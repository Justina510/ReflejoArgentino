import { useState, useEffect, useMemo } from 'react';
import MapChart from '../Charts/MapChart';
import Papa from 'papaparse';
import './MapaEmpleo.css';
import GraficoTorta from '../Charts/GraficoTorta';

const aglomeradoAProvincia = {
  "Gran La Plata": "Buenos Aires",
  "Bahía Blanca-Cerri": "Buenos Aires",
  "Gran Rosario": "Santa Fe",
  "Gran Santa Fe": "Santa Fe",
  "Gran Paraná": "Entre Ríos",
  "Posadas": "Misiones",
  "Gran Resistencia": "Chaco",
  "Comodoro Rivadavia-Rada Tilly": "Chubut",
  "Gran Mendoza": "Mendoza",
  "Corrientes": "Corrientes",
  "Gran Córdoba": "Córdoba",
  "Concordia": "Entre Ríos",
  "Formosa": "Formosa",
  "Neuquén-Plottier": "Neuquén",
  "Santiago del Estero-La Banda": "Santiago del Estero",
  "Jujuy-Palpalá": "Jujuy",
  "Río Gallegos": "Santa Cruz",
  "Gran Catamarca": "Catamarca",
  "Gran Salta": "Salta",
  "La Rioja": "La Rioja",
  "Gran San Luis": "San Luis",
  "Gran San Juan": "San Juan",
  "Gran Tucumán-Tafí Viejo": "Tucumán",
  "Santa Rosa-Toay": "La Pampa",
  "Ushuaia-Río Grande": "Tierra del Fuego",
  "Ciudad Autónoma de Buenos Aires": "Buenos Aires",
  "Partidos del GBA": "Buenos Aires",
  "Mar del Plata": "Buenos Aires",
  "Río Cuarto": "Córdoba",
  "San Nicolás-Villa Constitución": "Buenos Aires",
  "Rawson-Trelew": "Chubut",
  "Viedma-Carmen de Patagones": "Río Negro",
  "Resto Buenos Aires": "Buenos Aires",
  "Resto Catamarca": "Catamarca",
  "Resto Córdoba": "Córdoba",
  "Resto Corrientes": "Corrientes",
  "Resto Chaco": "Chaco",
  "Resto Chubut": "Chubut",
  "Resto Entre Ríos": "Entre Ríos",
  "Resto Formosa": "Formosa",
  "Resto Jujuy": "Jujuy",
  "Resto La Pampa": "La Pampa",
  "Resto La Rioja": "La Rioja",
  "Resto Mendoza": "Mendoza",
  "Resto Misiones": "Misiones",
  "Resto Neuquén": "Neuquén",
  "Resto Río Negro": "Río Negro",
  "Resto Salta": "Salta",
  "Resto San Juan": "San Juan",
  "Resto San Luis": "San Luis",
  "Resto Santa Cruz": "Santa Cruz",
  "Resto Santa Fe": "Santa Fe",
  "Resto Santiago del Estero": "Santiago del Estero",
  "Resto Tucumán": "Tucumán"
};

const provincias = [
  "Todas","Buenos Aires","Catamarca","Chaco","Chubut","Córdoba","Corrientes","Entre Ríos","Formosa",
  "Jujuy","La Pampa","La Rioja","Mendoza","Misiones","Neuquén","Río Negro","Salta","San Juan",
  "San Luis","Santa Cruz","Santa Fe","Santiago del Estero","Tierra del Fuego","Tucumán"
  
];

const provinciasOrdenadas = [
  "Todas",
  ...provincias.filter(p => p !== "Todas").sort((a,b) => a.localeCompare(b,'es'))
];

export default function MapaEmpleo() {
  const [año, setAño] = useState(2016);
  const [estado, setEstado] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [genero, setGenero] = useState([]);
  const [grupoActivo, setGrupoActivo] = useState(null); 
  const [datosBrutos, setDatosBrutos] = useState([]);
  const [provincia, setProvincia] = useState("Todas");

  function toggleSeleccion(valor, grupo, setGrupo, nombreGrupo) {
    if (!grupoActivo) {
      setGrupoActivo(nombreGrupo);
      setGrupo([valor]);
      return;
    }
    if (grupoActivo === nombreGrupo) {
      if (grupo.includes(valor)) {
        setGrupo(grupo.filter(v => v !== valor));
        if (grupo.length === 1) setGrupoActivo(null);
      } else {
        setGrupo([...grupo, valor]);
      }
    } else {
      setEstado([]);
      setTipo([]);
      setGenero([]);
      setGrupo([valor]);
      setGrupoActivo(nombreGrupo);
    }
  }

  useEffect(() => {
    Papa.parse('/BasesLimpias/eph_full.csv', {
      download: true,
      header: true,
      complete: (result) => {
        setDatosBrutos(result.data);
      }
    });
  }, []);

  const puntos = useMemo(() => {
    if (!datosBrutos.length) return [];

    const datosFiltrados = datosBrutos
      .map(d => {
        const añoCSV = parseInt(String(d.year).trim(), 10);
        if (isNaN(añoCSV) || añoCSV !== año) return null;

        let prov = d.PROVINCIA?.trim();
        if (!prov || prov === "") {
          const aglo = d['﻿AGLOMERADO']?.trim();
          prov = aglomeradoAProvincia[aglo] || null;
        }
        if (!prov) return null;
        if (provincia !== "Todas" && prov !== provincia) return null;

        const estadoVal = d.ESTADO?.trim() || null;
        const rawVal = Number(String(d.PP07G4).trim());
        let tipoVal = null;
        if (!isNaN(rawVal)) {
          if (Math.round(rawVal) === 1) tipoVal = 'Formal';
          else if (Math.round(rawVal) === 2) tipoVal = 'Informal';
        }
        const generoVal = d.CH04?.trim() === 'Mujer' ? 'Femenino' : 'Masculino';
        const ponderaVal = Number(String(d.PONDERA).trim()) || 1;

        return { prov, estadoVal, tipoVal, generoVal, pondera: ponderaVal };
      })
      .filter(d => d !== null);

    const puntosMap = [];
    const grupos = [
      { data: estado, key: 'estadoVal', colors: { 'Ocupado': 'var(--celeste)', 'Desocupado': 'var(--amarillo)' } },
      { data: tipo, key: 'tipoVal', colors: { 'Formal': 'var(--celeste)', 'Informal': 'var(--amarillo)' } },
      { data: genero, key: 'generoVal', colors: { 'Masculino': 'var(--celeste)', 'Femenino': 'var(--amarillo)' } }
    ];

    grupos.forEach(g => {
      if (g.data.length === 0) return;
      g.data.forEach(valorGrupo => {
        const filtered = datosFiltrados.filter(d => d[g.key] === valorGrupo);
        const countsByProv = {};
        filtered.forEach(d => {
          countsByProv[d.prov] = (countsByProv[d.prov] || 0) + d.pondera;
        });
        Object.entries(countsByProv).forEach(([prov, count]) => {
          puntosMap.push({
            PROVINCIA: prov,
            count,
            color: g.colors[valorGrupo] || '#00BFFF'
          });
        });
      });
    });

    return puntosMap;
  }, [datosBrutos, año, estado, tipo, genero, provincia]);

  const datosGrafico = useMemo(() => {
    const grupo = grupoActivo === 'estado' ? estado :
                  grupoActivo === 'tipo' ? tipo :
                  grupoActivo === 'genero' ? genero : [];

    if (grupo.length === 0) {
      const total = puntos.reduce((acc, p) => acc + p.count, 0);
      return [{ name: 'Total', value: total, color: 'var(--celeste)' }];
    }

    const totalTodos = puntos.reduce((acc, p) => acc + p.count, 0);

    return grupo.map(valor => {
      const color = (valor === 'Ocupado' || valor === 'Formal' || valor === 'Masculino') ? 'var(--celeste)' : 'var(--amarillo)';
      const valorCount = puntos.filter(p => p.color === color).reduce((acc, p) => acc + p.count, 0);
      return {
        name: valor,
        value: valorCount,
        percentage: ((valorCount / totalTodos) * 100).toFixed(1),
        color
      };
    });
  }, [puntos, grupoActivo, estado, tipo, genero]);

  return (
    <div className="mapa-empleo">
      <div className="contenedor-titulo">
        <h1>Mapa <em>de</em> Empleo Argentino</h1>
      </div>

      <div className="layout-3columnas">

        <div className="columna-izquierda">
          <div className="bloque-select-simple">
            <label htmlFor="año">Año</label>
            <select id="año" value={año} onChange={e => setAño(Number(e.target.value))}>
              {[2016,2017,2018,2019,2020,2021,2022,2023,2024,2025].map(y => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          <GraficoTorta data={datosGrafico} />
        </div>

        <div className="columna-centro">
          <div className="bloque-select-simple">
            <label htmlFor="provincia">Provincia</label>
            <select id="provincia" value={provincia} onChange={e => setProvincia(e.target.value)}>
              {provinciasOrdenadas.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="grupo-filtro">
            <p className="titulo-filtro">Estado laboral</p>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" checked={estado.includes('Ocupado')} onChange={() => toggleSeleccion('Ocupado', estado, setEstado, 'estado')}/>
                Ocupados
              </label>
              <label>
                <input type="checkbox" checked={estado.includes('Desocupado')} onChange={() => toggleSeleccion('Desocupado', estado, setEstado, 'estado')}/>
                Desocupados
              </label>
            </div>
          </div>

          <div className="grupo-filtro">
            <p className="titulo-filtro">Tipo de empleo</p>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" checked={tipo.includes('Formal')} onChange={() => toggleSeleccion('Formal', tipo, setTipo, 'tipo')}/>
                Formal
              </label>
              <label>
                <input type="checkbox" checked={tipo.includes('Informal')} onChange={() => toggleSeleccion('Informal', tipo, setTipo, 'tipo')}/>
                Informal
              </label>
            </div>
          </div>

          <div className="grupo-filtro">
            <p className="titulo-filtro">Género</p>
            <div className="checkbox-group">
              <label>
                <input type="checkbox" checked={genero.includes('Masculino')} onChange={() => toggleSeleccion('Masculino', genero, setGenero, 'genero')}/>
                Varones
              </label>
              <label>
                <input type="checkbox" checked={genero.includes('Femenino')} onChange={() => toggleSeleccion('Femenino', genero, setGenero, 'genero')}/>
                Mujeres
              </label>
            </div>
          </div>
        </div>

        <div className="texto-abajo">
          La estructura laboral argentina se despliega provincia por provincia, año tras año, revelando cómo se distribuyen las personas ocupadas y desocupadas, el trabajo formal e informal, y las diferencias entre géneros. Cada selección permite observar cómo varía el empleo en función del territorio, el tiempo y las condiciones sociales. Calculada mediante la ponderación oficial aplicada por el INDEC sobre los datos relevados por la Encuesta Permanente de Hogares y actualizada hasta el primer trimestre de 2025.
        </div>

        <div className="columna-derecha">
          <MapChart puntos={puntos} />
        </div>
      </div>
    </div>
  );
}