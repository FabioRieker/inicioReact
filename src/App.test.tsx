import { render, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

import App from './App';

vi.mock('./services/supabaseClient', () => ({
  fetchClients: vi.fn().mockResolvedValue([]),
  addClient: vi.fn(),
  isSupabaseConfigured: false,
}));

test('la barra de navegación muestra los tres enlaces principales', async () => {
  render(<App />);

  const nav = await screen.findByRole('navigation', { name: /navegación principal/i });

  expect(within(nav).getByRole('link', { name: 'Ver clientes' })).toHaveAttribute(
    'href',
    '/clientes',
  );
  expect(within(nav).getByRole('link', { name: 'Añadir cliente' })).toHaveAttribute(
    'href',
    '/clientes/nuevo',
  );
  expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
});

test('la raíz redirige a la página de clientes', async () => {
  render(<App />);

  expect(
    await screen.findByRole('heading', { level: 1, name: 'Clientes' }),
  ).toBeInTheDocument();
});
