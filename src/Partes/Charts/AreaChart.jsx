import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Legend,
} from "recharts";
import "./AreaChart.css";

export default function AreaChartActivos({ data }) {
  if (!data || data.length === 0) return null;

  const edadesX = [18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

  const processedData = edadesX.map((edad) => {
    const ocupadosEdad = data.filter(
      (d) => Number(d.CH06) === edad && d.ESTADO === "Ocupado"
    );

    const total = ocupadosEdad.reduce(
      (sum, d) => sum + Number(d.PONDERA || 0),
      0
    );

    const varones = ocupadosEdad
      .filter((d) => d.CH04 === "Varón")
      .reduce((sum, d) => sum + Number(d.PONDERA || 0), 0);

    const mujeres = ocupadosEdad
      .filter((d) => d.CH04 === "Mujer")
      .reduce((sum, d) => sum + Number(d.PONDERA || 0), 0);

    return {
      edad,
      Varones: total ? (varones / total) * 100 : 0,
      Mujeres: total ? (mujeres / total) * 100 : 0,
    };
  });

  return (
    <div className="area-chart-wrapper">
      <h3 className="area-chart-title">
        Trayectoria laboral de varones y mujeres por edad
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={processedData}>
          <XAxis
            dataKey="edad"
            label={{ value: "Edad", position: "insideBottom", offset: -5 }}
            ticks={edadesX}
          />
          <YAxis
            label={{ value: "% Activos", angle: -90, position: "insideLeft" }}
          />
          <Tooltip formatter={(value) => value.toFixed(1) + "%"} />
          <Legend verticalAlign="top" height={36} />
          <Area
            type="monotone"
            dataKey="Varones"
            stroke="#ff8d66"
            fill="#ff8d66"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="Mujeres"
            stroke="#2273f3"
            fill="#2273f3"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
