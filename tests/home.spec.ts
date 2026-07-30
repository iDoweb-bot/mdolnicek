import { test, expect } from '@playwright/test';

test('presents AI consultation and integration services', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Marek');
  await expect(page.getByRole('heading', { level: 2, name: 'Put AI to work in your real workflows' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'AI consultation & roadmap' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3, name: 'AI integration & automation' })).toBeVisible();
  await expect(page.getByText(/companies, product and service teams, agencies/)).toBeVisible();
});
