import { expect, test } from './fixtures';

const routes = [
	{ path: '/', heading: /SEBA/i },
	{ path: '/o-nas', heading: /rodina|parket/i },
	{ path: '/galeria', heading: /Momenty|vystúpen/i },
	{ path: '/videa', heading: /Klipy|nahrávk/i },
	{ path: '/rezervacie', heading: /Vstupenka|dátum/i },
	{ path: '/kontakt', heading: /linke|Kontakt/i },
	{ path: '/rezervacne-podmienky', heading: /Podmienky/i }
] as const;

test.describe('Stránky', () => {
	for (const route of routes) {
		test(`${route.path} vráti 200 a má nadpis`, async ({ page }) => {
			const res = await page.goto(route.path);
			expect(res?.ok()).toBeTruthy();
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			await expect(page.getByRole('heading', { level: 1 })).toContainText(route.heading);
		});
	}
});

test.describe('Navigácia', () => {
	test('hlavné menu vedie na sekcie', async ({ page }) => {
		await page.goto('/');

		const desktopLink = page.locator('header nav a', { hasText: 'Galéria' }).first();
		if (await desktopLink.isVisible()) {
			await desktopLink.click();
		} else {
			await page.getByRole('button', { name: /Otvoriť menu/i }).click();
			await page
				.getByRole('navigation', { name: /Mobilná/i })
				.getByRole('link', { name: 'Galéria' })
				.click();
		}

		await expect(page).toHaveURL(/\/galeria/);
		await expect(page.getByRole('heading', { level: 1 })).toContainText(/Momenty|vystúpen/i);
	});
});
