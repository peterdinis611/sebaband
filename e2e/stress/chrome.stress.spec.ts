import { expect, test } from '../fixtures';

test.describe('Stress — UI chrome', () => {
	test('prepínač témy 30× bez rozbitia layoutu', async ({ page }) => {
		await page.goto('/');
		const toggle = page.getByRole('button', { name: /režim/i });
		const html = page.locator('html');

		for (let i = 0; i < 30; i++) {
			await toggle.click();
			await expect(html).toHaveAttribute('data-theme', /^(light|dark)$/);
			await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
		}
	});

	test('scroll nahor / nadol + scroll-to-top', async ({ page }) => {
		await page.goto('/');
		for (let i = 0; i < 12; i++) {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(80);
			const btn = page.getByRole('button', { name: /Späť nahor/i });
			await expect(btn).toBeVisible();
			await btn.click();
			await expect
				.poll(async () => page.evaluate(() => window.scrollY))
				.toBeLessThan(80);
		}
	});

	test('mobilné menu otvor/zatvor spam', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');
		const openBtn = page.getByRole('button', { name: /Otvoriť menu/i });

		for (let i = 0; i < 20; i++) {
			await openBtn.click();
			await expect(page.getByRole('navigation', { name: /Mobilná/i })).toBeVisible();
			await page.getByRole('button', { name: /Zavrieť menu/i }).click();
			await expect(page.getByRole('navigation', { name: /Mobilná/i })).toHaveCount(0);
		}
	});
});
