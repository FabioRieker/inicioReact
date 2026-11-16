import { expect, test } from '@playwright/test';

test('la raíz abre el listado de clientes', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Ver clientes' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'Clientes' })).toBeVisible();
  await expect(page).toHaveURL(/\/clientes$/);
});
