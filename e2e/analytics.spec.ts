import { expect, test } from './fixtures';
import { nav } from '../src/lib/data/site';

test.describe('Analytics (skrytá stránka)', () => {
	test('existuje, ale nie je v menu ani footeri', async ({ page }) => {
		const res = await page.goto('/analytics');
		expect(res?.ok()).toBeTruthy();
		await expect(page.getByRole('heading', { level: 1 })).toContainText(/Analytics/i);
		await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i);

		for (const item of nav) {
			expect(item.href).not.toBe('/analytics');
			expect(item.label.toLowerCase()).not.toContain('analytic');
		}

		const header = page.locator('header');
		await expect(header.getByRole('link', { name: /Analytics/i })).toHaveCount(0);
		await expect(page.locator('footer').getByRole('link', { name: /Analytics/i })).toHaveCount(0);
	});

	test('po návšteve stránok ukáže lokálne hit-y', async ({ page }) => {
		await page.goto('/o-nas');
		await page.goto('/galeria');
		await page.goto('/analytics');
		await expect(page.getByText(/hitov/i)).toBeVisible();
		await expect(page.getByRole('cell', { name: '/o-nas' })).toBeVisible();
		await expect(page.getByRole('cell', { name: '/galeria' })).toBeVisible();
	});

	test('po klikoch ukáže heatmapu', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /Rezervácia/i }).first().click();
		await page.goto('/');
		await page.getByRole('link', { name: /Videá/i }).first().click();
		await page.goto('/analytics');
		await expect(page.getByRole('heading', { name: /Kde ľudia klikajú/i })).toBeVisible();
		await expect(page.getByLabel('Heatmapa klikov')).toBeVisible();
		await expect(page.locator('.heat-meta')).toContainText(/klikov/i);
	});
});
