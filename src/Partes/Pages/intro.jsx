import React from 'react';
import './intro.css';

export default function Intro() {
  return (
    <section className="intro">
      <p className="autor">Justina Quiroga Baquela</p>

      <header className="intro-titulos">
        <h1>MERCADO LABORAL E INFLACIÓN</h1>
        <h2>Reflejado en los Argentinos</h2>
      </header>

      <div className="intro-contenido">
        <img
          src="/Imagenes/Argentinos.png"
          alt="Imagen de argentinos"
          className="imagen-principal"
        />
        <div className="intro-texto">
          <p>
            En este trabajo se analiza el período comprendido entre 2016 y 2025,
            marcado por irregularidades profundas en el mercado laboral argentino
            y una inflación persistente que atraviesa la vida cotidiana. A través
            de datos provenientes del EPH y del IPC (INDEC), exploraremos el
            empleo y el desempleo, la formalidad o su ausencia, y cómo estos
            fenómenos se proyectan sobre la población. También nos detendremos
            en una dimensión cada vez más visible: el impacto emocional del
            trabajo en contextos de presión económica.
          </p>
          <img
            src="/Imagenes/Flecha.webp"
            alt="Flecha decorativa"
            className="flecha"
          />
        </div>
      </div>

      <figure className="grafico-container">
        <img
          src="/Imagenes/Grafico1.webp"
          alt="Gráfico circular"
          className="grafico"
        />
      </figure>
    </section>
  );
}
