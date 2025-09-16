import { useState, useEffect } from "react";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function LineaComparativa({ yearStart, yearEnd }) {
  const [data, setData] = useState([]);
  const [yearTicks, setYearTicks] = useState([]);

  useEffect(() => {
    const parseCSV = (url, delimiter = ",") =>
      fetch(url)
        .then(res => res.text())
        .then(text => Papa.parse(text, { header: true, delimiter }).data);

    Promise.all([
      parseCSV("/BasesLimpias/serie_ipc_divisiones.csv", ";"),
      parseCSV("/BasesLimpias/eph_full.csv")
    ]).then(([ipcRaw, ephRaw]) => {

      const ipcData = ipcRaw
        .filter(d => d.Descripcion === "NIVEL GENERAL" && d.Region === "Nacional")
        .map(d => {
          const year = parseInt(d.Periodo.slice(0, 4));
          const ipc = parseFloat(d.Indice_IPC.replace(",", "."));
          return { year, ipc };
        })
        .filter(d => !isNaN(d.ipc) && d.ipc > 0 && d.year >= yearStart && d.year <= yearEnd);

      const minYear = Math.min(...ipcData.map(d => d.year));
      const baseIPC = ipcData.find(d => d.year === minYear)?.ipc || 100;
      const ipcNormalized = ipcData.map(d => ({ year: d.year, ipc: (d.ipc / baseIPC) * 100 }));

      const ephData = ephRaw
        .filter(d => ["Ocupado", "Desocupado"].includes(d.ESTADO) &&
                     d.year >= yearStart && d.year <= yearEnd);

      const grouped = ephData.reduce((acc, d) => {
        const y = parseInt(d.year);
        if (!acc[y]) acc[y] = { ocup: 0, desocup: 0 };
        if (d.ESTADO === "Ocupado") acc[y].ocup += 1;
        else acc[y].desocup += 1;
        return acc;
      }, {});

      const mergedData = Object.entries(grouped).map(([y, val]) => {
        const ipcEntry = ipcNormalized.find(i => i.year === parseInt(y));
        return ipcEntry ? { year: parseInt(y), ocup: val.ocup / (val.ocup + val.desocup) * 100, desocup: val.desocup / (val.ocup + val.desocup) * 100, ipc: ipcEntry.ipc } : null;
      }).filter(d => d);

      setData(mergedData);
      setYearTicks(mergedData.map(d => d.year));
    });
  }, [yearStart, yearEnd]);

  return (
    <div style={{ width: "100%", height: 450, marginTop: "40px" }}>
      <h3>Evolución comparativa: IPC vs Ocupados/Desocupados</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
          <XAxis dataKey="year" ticks={yearTicks} />
          <YAxis yAxisId="left" tickFormatter={val => val.toFixed(1) + "%"} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={val => val.toFixed(0)} />
          <Tooltip formatter={(val, name) => name === "ipc" ? val.toFixed(1) + "%" : val.toFixed(1) + "%"} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="ocup" stroke="#6ce5e8" name="Ocupados (%)" />
          <Line yAxisId="left" type="monotone" dataKey="desocup" stroke="#ff8d66" name="Desocupados (%)" />
          <Line yAxisId="right" type="monotone" dataKey="ipc" stroke="#2273f3" name="IPC (base 100%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}