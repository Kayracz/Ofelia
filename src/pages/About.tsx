
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-image">
          <span>EDITORIAL IMAGE</span>
          <span>IMAGEN PENDIENTE</span>
        </div>

        <div className="about-hero-content">
          <p className="eyebrow">THE STORY BEHIND OFELIA</p>
          <h1>Una historia llamada Ofelia.</h1>
          <p>
            Una marca, un legado y una forma de expresarnos.
          </p>
        </div>
      </section>

      <section className="about-origin section-spacing">
        <div className="about-origin-image">
          <span>IMAGE 01 · INSPIRATION</span>
        </div>

        <div className="about-origin-content">
          <p className="eyebrow">WHERE IT ALL BEGINS</p>
          <h2>Todo comienza con ella.</h2>

          <p>
            Ofelia nace inspirada en nuestra abuela: en su esencia,
            en los recuerdos que nos acompañan y en esas pequeñas
            cosas que hacen que una historia sea única.
          </p>

          <p>
            Su nombre se convirtió en el punto de partida de una
            marca creada para celebrar la individualidad, la belleza
            de los detalles y las distintas formas de expresarnos.
          </p>
        </div>
      </section>

      <section className="about-quote">
        <p className="eyebrow">OUR PHILOSOPHY</p>
        <blockquote>
          “La belleza está en los detalles y en la forma única
          en que cada persona los hace suyos.”
        </blockquote>
        <span>THE OFELIA SPIRIT</span>
      </section>

      <section className="about-design section-spacing">
        <div className="about-design-content">
          <p className="eyebrow">DESIGNED WITH INTENTION</p>
          <h2>El arte de los pequeños detalles.</h2>

          <p>
            Creamos nuestros propios diseños pensando en cómo una
            pieza puede transformar un conjunto y convertirse en
            parte de tu estilo personal.
          </p>

          <p>
            Nos inspira la versatilidad de la seda y la libertad
            de llevarla de muchas maneras: alrededor del cuello,
            en el cabello, en un bolso o como tú quieras.
          </p>
        </div>

        <div className="about-design-image">
          <span>IMAGE 02 · THE CREATIVE PROCESS</span>
        </div>
      </section>

      <section className="about-values">
        <div>
          <p className="eyebrow">01 / PERSONALITY</p>
          <h3>Tu estilo, tus reglas.</h3>
          <p>
            Piezas que te invitan a experimentar y expresarte
            a tu manera.
          </p>
        </div>

        <div>
          <p className="eyebrow">02 / VERSATILITY</p>
          <h3>Muchas formas de llevarlo.</h3>
          <p>
            Un mismo pañuelo puede contar historias diferentes
            según cómo decidas usarlo.
          </p>
        </div>

        <div>
          <p className="eyebrow">03 / MEANING</p>
          <h3>Más que un accesorio.</h3>
          <p>
            Diseños que nacen de una inspiración y encuentran
            un nuevo significado en quien los lleva.
          </p>
        </div>
      </section>

      <section className="about-closing">
        <div className="about-closing-image">
          <span>EDITORIAL IMAGE · OFELIA COLLECTION</span>
        </div>

        <div className="about-closing-content">
          <p className="eyebrow">YOUR STORY, YOUR OFELIA</p>
          <h2>Hecho para ser parte de tu historia.</h2>
          <Link to="/productos" className="text-link">
            DESCUBRIR LA COLECCIÓN <span>↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
