import './App.css';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Intro from './Partes/Pages/intro';
import MapaEmpleo from './Partes/Pages/MapaEmpleo';
import Year from './Partes/Pages/Year';
import Periodo from './Partes/Pages/Periodo';
import Fin from './Partes/Pages/Fin';

function App() {
  const [ephData, setEphData] = useState([]);
  const [ipcData, setIpcData] = useState([]);
  const [smvmData, setSmvmData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const ephResponse = await fetch('/BasesLimpias/eph_full.csv');
        const ephText = await ephResponse.text();
        const ephParsed = Papa.parse(ephText, { header: true, skipEmptyLines: true }).data;

        const ipcResponse = await fetch('/BasesLimpias/serie_ipc_divisiones.csv');
        const ipcText = await ipcResponse.text();
        const ipcParsed = Papa.parse(ipcText, { header: true, skipEmptyLines: true, delimiter: ';' }).data;

        const smvmResponse = await fetch('/BasesLimpias/smvm.csv');
        const smvmText = await smvmResponse.text();
        const smvmParsed = Papa.parse(smvmText, { header: true, skipEmptyLines: true }).data;

        setEphData(ephParsed);
        setIpcData(ipcParsed);
        setSmvmData(smvmParsed);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "100px" }}>Cargando datos...</div>;

  return (
    <div className="App">
      <section className="fullpage-section"><Intro /></section>
      <section className="fullpage-section"><MapaEmpleo ephData={ephData} /></section>
      <section className="fullpage-section"><Year ephData={ephData} ipcData={ipcData} smvmData={smvmData} /></section>
      <section className="fullpage-section"><Periodo ephData={ephData} /></section>
      <section className="fullpage-section"><Fin /></section>
    </div>
  );
}

export default App;
