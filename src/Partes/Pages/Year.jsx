import { useState, useEffect, useMemo } from "react";
import TreemapRecharts from "../Charts/TreemapRecharts";
import AreaChartActivos from "../Charts/AreaChart"; 
import BarChartSegmented from "../Charts/BarChartSegmented";
import "./Year.css";

export default function Year() {
  const [año, setAño] = useState(2016);
  const [csvRows, setCsvRows] = useState([]);

  // Carga del CSV una sola vez
  useEffect(() => {
    fetch("/BasesLimpias/eph_full.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const [headerLine, ...lines] = csvText.split("\n");
        const headers = headerLine.split(",");
        const parsedRows = lines
          .map((line) => {
            if (!line) return null;
            const cells = line.split(",");
            const obj = {};
            headers.forEach((h, i) => {
              obj[h] = cells[i];
            });
            return obj;
          })
          .filter(Boolean);
        setCsvRows(parsedRows);
      });
  }, []);

  // Genera datos del treemap memoizados para mejorar rendimiento
  const treemapData = useMemo(() => {
    if (!csvRows.length) return [];

    const groups = {
      "18-29": { Formal: 0, Informal: 0, Desocupado: 0 },
      "30-39": { Formal: 0, Informal: 0, Desocupado: 0 },
      "40-49": { Formal: 0, Informal: 0, Desocupado: 0 },
      "50-70": { Formal: 0, Informal: 0, Desocupado: 0 },
    };

    csvRows.forEach((data) => {
      if (Number(data.year) !== año) return;

      const edad = Number(data.CH06);
      let grupo = "";
      if (edad >= 18 && edad <= 29) grupo = "18-29";
      else if (edad >= 30 && edad <= 39) grupo = "30-39";
      else if (edad >= 40 && edad <= 49) grupo = "40-49";
      else if (edad >= 50 && edad <= 70) grupo = "50-70";
      else return;

      const pondera = Number(data.PONDERA) || 1;

      if (data.ESTADO === "Desocupado") groups[grupo].Desocupado += pondera;
      else if (data.ESTADO === "Ocupado") {
        const tipo = Number(data.PP07G4);
        if (tipo === 1) groups[grupo].Formal += pondera;
        else if (tipo === 2) groups[grupo].Informal += pondera;
      }
    });

    return Object.keys(groups).map((g) => ({
      name: g,
      children: [
        { name: "Formal", size: groups[g].Formal },
        { name: "Informal", size: groups[g].Informal },
        { name: "Desocupado", size: groups[g].Desocupado },
      ],
    }));
  }, [csvRows, año]);

  // Filtra datos para gráficos (Area y Bar) memoizados para no recalcular en cada render
  const csvRowsFiltrados = useMemo(() => {
    return csvRows.filter((d) => Number(d.year) === año);
  }, [csvRows, año]);

  return (
    <div className="year-page">
      <div className="year-layout">

        {/* LADO IZQUIERDO */}
        <div className="year-left">
          <div className="slider-container">
            <label>
              Año: <span className="anio">{año}</span>
            </label>
            <div className="slider-bg">
              <input
                type="range"
                min="2016"
                max="2025"
                value={año}
                onChange={(e) => setAño(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="texto-left">
            <p>
              La participación laboral en Argentina varía según edad y género. Los jóvenes suelen estar inactivos por estudios, los adultos concentran la mayor parte del empleo, y los mayores tienden a retirarse o quedar inactivos por edad o salud. Las mujeres presentan mayores niveles de inactividad, muchas veces por tareas de cuidado o trabajo doméstico no remunerado.
            </p>
            <p>
              En los siguientes gráficos se puede observar cómo se distribuye el empleo según los rangos de edad, hasta qué momento permanecen activos varones y mujeres, y cuántas personas están ocupadas, desocupadas o inactivas en cada grupo. Las diferencias por género se acentúan con la edad, revelando desigualdades en relación al trabajo, responsabilidades familiares, oportunidades formales y estabilidad económica.
            </p>
          </div>

          <TreemapRecharts data={treemapData} title="Distribución laboral por grupo etario" />
        </div>

        {/* LADO DERECHO */}
        <div className="year-right">
          <div className="texto-right-burnout">
            <div className="texto-imagen-container">
              <div className="texto-burnout">
                <p>Entre la necesidad de sostenerse y la dificultad de llegar, se forma una cadena que aprieta el empleo o su ausencia afecta la mente, y cuando el ingreso no alcanza, la presión se multiplica. El trabajo deja de ser solo rutina y se vuelve carga emocional.</p>
                <p>Según datos relevados por el Estudio Burnout 2024 de Bumeran, el 91% de los trabajadores argentinos manifiestan sentirse “quemados” o emocionalmente afectados por su situación laboral, en un contexto marcado por exigencias crecientes, jornadas extensas y presiones económicas. El pictograma que acompaña esta sección desglosa ese malestar en tres dimensiones:</p>
                <ul className="burnout-list">
                  <li>77% de los encuestados reportan síntomas de estrés laboral</li>
                  <li>70% mencionan agotamiento físico o mental vinculado a la sobrecarga de tareas</li>
                  <li>41% señalan un cansancio anormal por exceso de trabajo</li>
                </ul>
                <p>Estos datos revelan que el trabajo o su ausencia no solo impacta en lo económico, sino también en la salud emocional de las personas.</p>
              </div>
              <div className="imagen-burnout">
                <img src="/Imagenes/personita.png" alt="Personita Burnout" />
              </div>
            </div>
          </div>

          {/* GRAFICOS */}
          <div className="charts-row">
            <div className="area-chart-container">
              <AreaChartActivos data={csvRowsFiltrados} />
            </div>

            <div className="bar-chart-container">
             
              <BarChartSegmented data={csvRowsFiltrados} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
