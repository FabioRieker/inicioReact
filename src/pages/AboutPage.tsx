import { IonContent, IonPage } from '@ionic/react';

import AppNavbar from '../components/AppNavbar';
import { usePageTitle } from '../hooks/usePageTitle';

import './AboutPage.css';

const STACK = ['React 19', 'TypeScript', 'Vite 8', 'Ionic 9', 'Supabase', 'Vercel'];

const FACTS = [
  { label: 'Frontend', value: 'React 19 + TypeScript' },
  { label: 'Interfaz', value: 'Ionic 9' },
  { label: 'Backend', value: 'Supabase · PostgREST' },
  { label: 'Deploy', value: 'Vercel' },
];

const AboutPage: React.FC = () => {
  usePageTitle('About');

  return (
    <IonPage>
      <AppNavbar />

      <IonContent className="app-content">
        <main className="page-wrap">
          <header className="page-head rise">
            <div className="page-head-copy">
              <p className="eyebrow">About</p>
              <h1 className="page-title">Sobre este proyecto</h1>
              <p className="page-lead">
                Un ejercicio pequeño pero completo: interfaz, validación, base de datos y despliegue
                conviviendo en un mismo repositorio.
              </p>
            </div>
          </header>

          <div className="about-layout">
            <article className="card prose-card rise-late" aria-labelledby="about-story-title">
              <h2 className="section-title" id="about-story-title">
                Un flujo real, sin servidor propio
              </h2>

              <p>
                Clientes App es una aplicación de ejemplo construida con <strong>React 19</strong>,{' '}
                <strong>TypeScript</strong> y <strong>Vite 8</strong>. Sirve para practicar un flujo
                completo de datos: listar, validar y crear registros contra un backend real sin
                escribir ni desplegar un servidor propio.
              </p>

              <p>
                La interfaz se apoya en los componentes de <strong>Ionic</strong> para la navegación,
                la cabecera y el contenido, y añade estilos propios con variables de tema. El
                resultado se comporta como una app nativa en móvil y como una página rápida y
                accesible en escritorio, con soporte para modo claro y oscuro.
              </p>

              <p>
                <strong>Supabase</strong> actúa como backend-as-a-service. La tabla{' '}
                <code>clients</code> se expone automáticamente mediante PostgREST, de modo que el
                cliente oficial de Supabase puede consultar y crear filas con unas pocas líneas de
                código, sin endpoints intermedios ni controladores adicionales.
              </p>

              <p>
                El proyecto se compila como una SPA y se publica en <strong>Vercel</strong>. Cada
                push genera una vista previa, y producción solo necesita dos variables de entorno:{' '}
                <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
              </p>
            </article>

            <aside className="about-aside">
              <section className="card facts-card" aria-labelledby="facts-title">
                <h2 className="section-title" id="facts-title">
                  En resumen
                </h2>
                <dl className="facts-list">
                  {FACTS.map((fact) => (
                    <div className="fact-row" key={fact.label}>
                      <dt className="fact-label">{fact.label}</dt>
                      <dd className="fact-value">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="card chips-card" aria-labelledby="stack-title">
                <h2 className="section-title" id="stack-title">
                  Stack
                </h2>
                <ul className="chip-list" aria-label="Tecnologías utilizadas en el proyecto">
                  {STACK.map((item) => (
                    <li className="chip" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>

          <figure className="about-figure figure-frame rise-late">
            <img
              src="/about/stack.webp"
              alt="Banner del stack: React, TypeScript, Ionic, Supabase y Vercel"
              width={1600}
              height={900}
              decoding="async"
            />
            <figcaption>Stack técnico del proyecto: interfaz, datos y despliegue.</figcaption>
          </figure>

          <section className="video-section" aria-labelledby="video-title">
            <div className="video-head">
              <p className="eyebrow">Para profundizar</p>
              <h2 className="section-title video-title" id="video-title">
                Supabase, tutorial práctico y overview
              </h2>
              <p className="video-intro">
                Una introducción en español a la API REST que consume esta aplicación. Ideal si
                quieres entender qué ocurre detrás de <code>fetchClients()</code> y{' '}
                <code>addClient()</code>.
              </p>
            </div>

            <div className="video-frame">
              <iframe
                src="https://www.youtube-nocookie.com/embed/pi33WDrgfpI"
                title="Supabase, Tutorial Práctico y Overview (REST API) — Fazt Code"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            <p className="video-caption">
              <strong>Supabase, Tutorial Práctico y Overview (REST API)</strong> — Fazt Code. Vídeo
              alojado en YouTube.
            </p>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default AboutPage;
