import { IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';
import {
  addOutline,
  checkmarkCircleOutline,
  cloudOfflineOutline,
  informationCircleOutline,
  peopleOutline,
  refreshOutline,
} from 'ionicons/icons';
import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import AppNavbar from '../components/AppNavbar';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Client } from '../interfaces/Client';
import { addClient, isSupabaseConfigured } from '../services/supabaseClient';

import './NewClientPage.css';

type FieldName = 'name' | 'email' | 'phone';
type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

const INITIAL_VALUES: FormValues = { name: '', email: '', phone: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+()\d\s.-]{7,}$/;

const FIELDS: {
  name: FieldName;
  label: string;
  placeholder: string;
  autoComplete: string;
  type: 'text' | 'email' | 'tel';
  optional?: boolean;
}[] = [
  {
    name: 'name',
    label: 'Nombre',
    placeholder: 'Ada Lovelace',
    autoComplete: 'name',
    type: 'text',
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'ada@empresa.com',
    autoComplete: 'email',
    type: 'email',
  },
  {
    name: 'phone',
    label: 'Teléfono',
    placeholder: '+34 600 123 456',
    autoComplete: 'tel',
    type: 'tel',
    optional: true,
  },
];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();

  if (!name) {
    errors.name = 'Escribe el nombre del cliente.';
  } else if (name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  }

  if (!email) {
    errors.email = 'Escribe un correo electrónico.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Introduce un correo válido, por ejemplo ada@empresa.com.';
  }

  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = 'Introduce un teléfono válido, por ejemplo +34 600 123 456.';
  }

  return errors;
}

const NewClientPage: React.FC = () => {
  usePageTitle('Añadir cliente');

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<Client | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = validate(values);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setSubmitError(null);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const field = event.target.name as FieldName;
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const resetForm = () => {
    setValues(INITIAL_VALUES);
    setTouched({});
    setSubmitted(false);
    setSubmitError(null);
    setCreated(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isSupabaseConfigured) {
      setSubmitError(
        'Supabase no está configurado. Añade las credenciales en el archivo .env para guardar clientes.',
      );
      return;
    }

    const currentErrors = validate(values);
    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    setSaving(true);
    setSubmitError(null);

    try {
      const client = await addClient({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
      });
      setCreated(client);
      setValues(INITIAL_VALUES);
      setTouched({});
      setSubmitted(false);
    } catch (cause) {
      setSubmitError(
        cause instanceof Error && cause.message
          ? cause.message
          : 'No hemos podido guardar el cliente. Inténtalo de nuevo.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <AppNavbar />

      <IonContent className="app-content">
        <main className="page-wrap">
          <header className="page-head rise">
            <div className="page-head-copy">
              <p className="eyebrow">Nuevo registro</p>
              <h1 className="page-title">Añadir cliente</h1>
              <p className="page-lead">
                Solo necesitas tres datos. Los validamos en el navegador y guardamos el registro en
                la tabla <code>clients</code> de Supabase.
              </p>
            </div>
          </header>

          {!isSupabaseConfigured && (
            <div className="banner rise" id="config-warning" role="status">
              <IonIcon className="banner-icon" icon={cloudOfflineOutline} aria-hidden="true" />
              <div>
                <p className="banner-title">Supabase no está configurado</p>
                <p className="banner-text">
                  El formulario está listo, pero no puede guardar nada todavía. Añade{' '}
                  <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> a tu archivo{' '}
                  <code>.env</code> y recarga la página.
                </p>
              </div>
            </div>
          )}

          {created ? (
            <section className="card success-card rise-late" role="status" aria-live="polite">
              <span className="success-icon">
                <IonIcon icon={checkmarkCircleOutline} aria-hidden="true" />
              </span>
              <div>
                <p className="eyebrow">Guardado</p>
                <h2 className="success-title">Cliente creado</h2>
              </div>
              <p className="success-text">
                <strong>{created.name}</strong> ya forma parte de tu cartera.
              </p>

              <dl className="detail-grid">
                <div className="detail-item">
                  <dt>Nombre</dt>
                  <dd>{created.name}</dd>
                </div>
                <div className="detail-item">
                  <dt>Email</dt>
                  <dd>{created.email}</dd>
                </div>
                <div className="detail-item">
                  <dt>Teléfono</dt>
                  <dd>{created.phone || '—'}</dd>
                </div>
              </dl>

              <div className="stack-actions">
                <Link className="btn btn-primary" to="/clientes">
                  <IonIcon icon={peopleOutline} aria-hidden="true" />
                  Ver clientes
                </Link>
                <button type="button" className="btn btn-ghost" onClick={resetForm}>
                  <IonIcon icon={addOutline} aria-hidden="true" />
                  Registrar otro cliente
                </button>
              </div>
            </section>
          ) : (
            <div className="client-layout">
              <section className="card form-card rise-late" aria-labelledby="new-client-title">
                <h2 className="form-title" id="new-client-title">
                  Datos del cliente
                </h2>
                <p className="form-intro">
                  Los campos marcados con <span className="req">*</span> son obligatorios.
                </p>

                {submitError && (
                  <div className="banner banner-danger" role="alert">
                    <IonIcon className="banner-icon" icon={informationCircleOutline} aria-hidden="true" />
                    <div>
                      <p className="banner-title">No se pudo guardar</p>
                      <p className="banner-text">{submitError}</p>
                    </div>
                  </div>
                )}

                <form className="client-form" noValidate onSubmit={handleSubmit} aria-busy={saving}>
                  <div className="form-grid">
                    {FIELDS.map((field) => {
                      const error = errors[field.name];
                      const visibleError = (submitted || touched[field.name]) && error;
                      const errorId = `client-${field.name}-error`;

                      return (
                        <div className="field" key={field.name}>
                          <label htmlFor={`client-${field.name}`}>
                            {field.label}{' '}
                            {field.optional ? (
                              <span className="optional">(opcional)</span>
                            ) : (
                              <span className="req" aria-hidden="true">*</span>
                            )}
                          </label>
                          <input
                            id={`client-${field.name}`}
                            name={field.name}
                            type={field.type}
                            className="field-input"
                            value={values[field.name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={field.placeholder}
                            autoComplete={field.autoComplete}
                            required={!field.optional}
                            aria-required={!field.optional}
                            aria-invalid={visibleError ? true : false}
                            aria-describedby={errorId}
                            spellCheck={field.name === 'email' ? false : undefined}
                            inputMode={field.name === 'email' ? 'email' : undefined}
                          />
                          <p
                            className="field-message"
                            id={errorId}
                            role={visibleError ? 'alert' : undefined}
                          >
                            {visibleError ? error : ''}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving || !isSupabaseConfigured}
                      aria-describedby={!isSupabaseConfigured ? 'config-warning' : undefined}
                    >
                      {saving ? (
                        <IonSpinner className="btn-spinner" name="crescent" aria-hidden="true" />
                      ) : (
                        <IonIcon icon={addOutline} aria-hidden="true" />
                      )}
                      {saving ? 'Guardando…' : 'Guardar cliente'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-quiet"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      <IonIcon icon={refreshOutline} aria-hidden="true" />
                      Limpiar
                    </button>
                    {!isSupabaseConfigured && (
                      <span className="form-note">
                        Configura Supabase para habilitar el guardado.
                      </span>
                    )}
                  </div>
                </form>
              </section>

              <aside className="card aside-card rise-late" aria-labelledby="form-aside-title">
                <h2 className="aside-title" id="form-aside-title">
                  Qué pasa al guardar
                </h2>
                <ol className="aside-list">
                  <li>
                    <span className="step-dot" aria-hidden="true">
                      1
                    </span>
                    <span>Validamos el nombre, el correo y el teléfono en el navegador.</span>
                  </li>
                  <li>
                    <span className="step-dot" aria-hidden="true">
                      2
                    </span>
                    <span>
                      Insertamos la fila en la tabla <code>clients</code> de Supabase mediante su
                      API REST.
                    </span>
                  </li>
                  <li>
                    <span className="step-dot" aria-hidden="true">
                      3
                    </span>
                    <span>Te mostramos el cliente creado para que compruebes los datos.</span>
                  </li>
                </ol>
              </aside>
            </div>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default NewClientPage;
