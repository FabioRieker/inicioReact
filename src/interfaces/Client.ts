/**
 * Fila de la tabla `clients` de Supabase.
 * Esquema real: id (int8, identity), name (varchar), email (varchar), phone (varchar).
 */
export interface Client {
  id?: number;
  name: string;
  email: string;
  phone: string;
}
