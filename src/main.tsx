import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { logSupabaseConnection } from './services/supabaseClient';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Reto 1: se ejecuta una sola vez a nivel de módulo (StrictMode no lo duplica).
void logSupabaseConnection();
