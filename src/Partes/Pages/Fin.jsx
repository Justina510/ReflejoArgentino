import React from "react";
import "./Fin.css";

export default function Fin() {
  return (
    <section className="fin-section">
      <div className="fin-titulo">
        <h1>
          EL TRABAJADOR <span className="invisible">invisible</span>
        </h1>
      </div>

      <p className="fin-texto">
        Este recorrido por el empleo y la inflación en Argentina entre 2016 y 2025 deja en evidencia una realidad compleja y muchas veces silenciada. 
        El trabajo informal, la desigualdad de género, la desocupación juvenil y la inflación persistente configuran un escenario que afecta profundamente a los argentinos.
        Pero hay un aspecto que permanece en las sombras: la salud mental de los trabajadores.
        Este proyecto nació con la intención de visibilizar cómo el empleo y la economía impactan en el bienestar emocional de las personas. 
        Sin embargo, la falta de datos concretos y la escasa atención dificultan esa tarea. La salud mental sigue siendo un tema marginal en las estadísticas laborales, a pesar de su relevancia.
      </p>

      <div className="fin-graficos">
        <img src="/Imagenes/Grafico3.webp" alt="Grafico 3" />
        <img src="/Imagenes/Grafico1.webp" alt="Grafico 1" />
        <img src="/Imagenes/Grafico2.webp" alt="Grafico 2" />
      </div>

      <div className="fin-footer">
        <p className="fin-footer-left">
          DESARROLLADO POR
          <br />
          <a
            href="https://github.com/Justina510"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Justina Quiroga Baquela</strong>
          </a>
        </p>

        <p className="fin-footer-center">
          <a
            href="https://udesa.edu.ar/contar-con-datos"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contar con datos 2025
          </a>
        </p>

        <p className="fin-footer-right">
          FUENTES Y BASES DE DATOS:
          <br />
          INDEC: IPC - EPH
          <br />
          Argentina.gob.ar: Evolución del Salario Mínimo Vital y Móvil
        </p>
      </div>
    </section>
  );
}