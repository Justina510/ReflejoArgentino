import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './GraficoTorta.css';

export default function GraficoTorta({ data }) {
  return (
    <div className="grafico-torta-container">
      <h3 className="chart-title">Porcentaje de los grupos</h3>
      {data.length === 0 ? (
        <p>No hay datos disponibles</p>
      ) : (
        <ResponsiveContainer width="100%" height={370}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={130}
              label={(entry) => `${entry.percentage || 100}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `${Number(value).toLocaleString('es-AR')} personas`} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}