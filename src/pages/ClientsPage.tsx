import { IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import {
  addOutline,
  cloudOfflineOutline,
  peopleOutline,
  refreshOutline,
  warningOutline,
} from 'ionicons/icons';
import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import AppNavbar from '../components/AppNavbar';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Client } from '../interfaces/Client';
import { fetchClients, isSupabaseConfigured } from '../services/supabaseClient';

import './ClientsPage.css';

type LoadState = 'loading' | 'ready' | 'error';

function errorMessageOf(cause: unknown): string {
  return cause instanceof Error && cause.message
    ? cause.message
    : 'No hemos podido cargar los clientes. Inténtalo de nuevo.';
}

function initialsOf(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');

  return letters.toUpperCase() || '?';
}

const ClientsPage: React.FC = () => {
  usePageTitle('Clientes');

  const [clients, setClients] = useState<Client[]>([]);
  const [state, setState] = useState<LoadState>(isSupabaseConfigured ? 'loading' : 'ready');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let active = true;

    const run = async () => {
      try {
        const data = await fetchClients();
        if (!active) {
          return;
        }
        setClients(data);
        setError(null);
        setState('ready');
      } catch (cause) {
        if (!active) {
          return;
        }
        setError(errorMessageOf(cause));
        setState('error');
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [reloadToken]);

  const reload = () => {
    setState('loading');
    setError(null);
    setReloadToken((token) => token + 1);
  };

  const isLoading = state === 'loading';
  const countLabel = `${clients.length} ${clients.length === 1 ? 'cliente' : 'clientes'}`;

  return (
    <IonPage>
      <AppNavbar />

      <IonContent className="app-content">
        <main className="page-wrap">
          <header className="page-head rise">
            <div className="page-head-copy">
              <p className="eyebrow">Cartera</p>
              <h1 className="page-title">Clientes</h1>
              <p className="page-lead">
                Toda tu cartera en un solo lugar. Consulta el nombre, el correo y el teléfono de
                cada cliente, o suma uno nuevo en unos segundos.
              </p>
            </div>

            <div className="head-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={reload}
                disabled={!isSupabaseConfigured || isLoading}
              >
                <IonIcon icon={refreshOutline} aria-hidden="true" />
                Actualizar
              </button>
              <Link className="btn btn-primary" to="/clientes/nuevo">
                <IonIcon icon={addOutline} aria-hidden="true" />
                Añadir cliente
              </Link>
            </div>
          </header>

          {!isSupabaseConfigured && (
            <div className="banner rise" style={{ '--rise-delay': 1 } as CSSProperties}>
              <IonIcon className="banner-icon" icon={cloudOfflineOutline} aria-hidden="true" />
              <div>
                <p className="banner-title">Supabase no está configurado</p>
                <p className="banner-text">
                  Añade <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> a tu
                  archivo <code>.env</code> para cargar y guardar clientes. Mientras tanto verás el
                  listado vacío.
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="card clients-loading" role="status" aria-live="polite">
              <IonSpinner name="crescent" aria-hidden="true" />
              <span>Cargando clientes…</span>
            </div>
          )}

          {state === 'error' && (
            <section className="card error-card" role="alert">
              <span className="state-icon state-icon-danger">
                <IonIcon icon={warningOutline} aria-hidden="true" />
              </span>
              <h2 className="state-title">No hemos podido cargar los clientes</h2>
              <p className="state-text">
                {error ??
                  'Ha ocurrido un error inesperado al consultar Supabase. Inténtalo de nuevo.'}
              </p>
              <div className="stack-actions">
                <button type="button" className="btn btn-primary" onClick={reload}>
                  <IonIcon icon={refreshOutline} aria-hidden="true" />
                  Reintentar
                </button>
                <Link className="btn btn-ghost" to="/clientes/nuevo">
                  Añadir cliente
                </Link>
              </div>
            </section>
          )}

          {state === 'ready' && (
            <section
              className="card clients-panel rise-late"
              aria-labelledby="clients-list-title"
            >
              <div className="clients-toolbar">
                <div className="clients-toolbar-title">
                  <h2 className="section-title" id="clients-list-title">
                    Listado de clientes
                  </h2>
                  <span className="badge">{countLabel}</span>
                </div>
                <p className="clients-toolbar-note">
                  {isSupabaseConfigured
                    ? 'Datos en vivo desde Supabase.'
                    : 'Vista de ejemplo sin conexión a Supabase.'}
                </p>
              </div>

              <div className="table-scroll" tabIndex={0} role="region" aria-label="Tabla de clientes">
                <table className="clients-table">
                  <caption className="sr-only">
                    Clientes con su nombre, correo electrónico y teléfono
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Nombre</th>
                      <th scope="col">Email</th>
                      <th scope="col">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan={3}>
                          <div className="state-card">
                            <span className="state-icon">
                              <IonIcon icon={peopleOutline} aria-hidden="true" />
                            </span>
                            <h3 className="state-title">No hay clientes todavía</h3>
                            <p className="state-text">
                              {isSupabaseConfigured
                                ? 'Cuando registres tu primer cliente aparecerá aquí, listo para consultar.'
                                : 'Configura Supabase para poder cargar y guardar clientes desde la aplicación.'}
                            </p>
                            {isSupabaseConfigured && (
                              <Link className="btn btn-primary" to="/clientes/nuevo">
                                <IonIcon icon={addOutline} aria-hidden="true" />
                                Añadir cliente
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      clients.map((client, index) => (
                        <tr key={client.id ?? `${client.email}-${index}`}>
                          <td>
                            <span className="client-cell">
                              <span className="client-avatar" aria-hidden="true">
                                {initialsOf(client.name)}
                              </span>
                              <span className="client-name">{client.name}</span>
                            </span>
                          </td>
                          <td>
                            <a className="client-email" href={`mailto:${client.email}`}>
                              {client.email}
                            </a>
                          </td>
                          <td>
                            <span className="client-phone">{client.phone || '—'}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default ClientsPage;
