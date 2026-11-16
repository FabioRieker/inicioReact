import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Client } from '../interfaces/Client';

/**
 * URL y clave pública (publishable/anon) del proyecto Supabase.
 * Se leen de las variables de entorno de Vite en tiempo de build.
 */
export const SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_KEY: string = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

const SUPABASE_URL_PATTERN = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i;

/**
 * true solo cuando la URL apunta a un proyecto Supabase real y la clave
 * tiene una longitud mínima razonable. Evita crear el cliente con valores
 * de plantilla (por ejemplo, los que contienen "xxxx").
 */
export const isSupabaseConfigured: boolean =
  SUPABASE_URL_PATTERN.test(SUPABASE_URL) && !SUPABASE_URL.includes('xxxx') && SUPABASE_KEY.length > 20;

/**
 * Cliente de Supabase o null si no hay configuración válida.
 * Nunca se llama a createClient con cadenas vacías porque lanza un error.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const NOT_CONFIGURED_MESSAGE =
  'Supabase no está configurado. Define VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env';

/**
 * Comprueba la conexión contando las filas de la tabla `clients`.
 * No lanza: devuelve el error en el objeto de resultado.
 */
export async function checkConnection(): Promise<{ ok: boolean; count?: number; error?: string }> {
  if (!supabase) {
    return { ok: false, error: NOT_CONFIGURED_MESSAGE };
  }

  try {
    const { count, error } = await supabase.from('clients').select('id', { count: 'exact', head: true });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, count: count ?? 0 };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Recupera todos los clientes ordenados por nombre.
 */
export async function fetchClients(): Promise<Client[]> {
  if (!supabase) {
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }

  const { data, error } = await supabase.from('clients').select('id, name, email, phone').order('name', { ascending: true });

  if (error) {
    throw new Error(`No se pudieron cargar los clientes: ${error.message}`);
  }

  return (data ?? []) as Client[];
}

/**
 * Inserta un cliente y devuelve la fila creada.
 */
export async function addClient(client: Omit<Client, 'id'>): Promise<Client> {
  if (!supabase) {
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }

  const { data, error } = await supabase
    .from('clients')
    .insert([{ name: client.name, email: client.email, phone: client.phone }])
    .select('id, name, email, phone')
    .single();

  if (error) {
    throw new Error(`No se pudo crear el cliente: ${error.message}`);
  }

  return data as Client;
}

function maskKey(key: string): string {
  return `${key.slice(0, 12)}…${key.slice(-4)}`;
}

function projectRefFromUrl(url: string): string {
  try {
    return new URL(url).hostname.split('.')[0];
  } catch {
    return '';
  }
}

/**
 * Reto 1: muestra en consola el estado de la conexión con Supabase.
 * Nunca lanza; cualquier fallo se registra con console.error.
 */
export async function logSupabaseConnection(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('❌ Conexión no configurada: define VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env');
    return;
  }

  try {
    const startedAt = performance.now();
    const result = await checkConnection();
    const latencyMs = Math.round((performance.now() - startedAt) * 100) / 100;

    if (!result.ok) {
      console.error('❌ Error de conexión con Supabase', result.error);
      return;
    }

    console.log('%c✅ Conexión correcta con Supabase', 'color:#16a34a;font-weight:bold;font-size:14px');
    console.log({
      url: SUPABASE_URL,
      projectRef: projectRefFromUrl(SUPABASE_URL),
      publishableKey: maskKey(SUPABASE_KEY),
      tabla: 'clients',
      registros: result.count,
      latenciaMs: latencyMs,
      hora: new Date().toLocaleString('es-ES'),
    });

    const { data, error } = await supabase
      .from('clients')
      .select('id, name, email, phone')
      .order('name', { ascending: true })
      .limit(5);

    if (error) {
      console.error('❌ Error de conexión con Supabase', error);
      return;
    }

    console.table(data ?? []);
  } catch (error) {
    console.error('❌ Error de conexión con Supabase', error);
  }
}
