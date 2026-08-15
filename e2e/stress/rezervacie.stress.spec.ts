import { expect, site, test } from '../fixtures';

test.describe('Stress — rezervácie', () => {
	test('opakované načítanie kalendára a dopytu', async ({ page }) => {
		for (let i = 0; i < 15; i++) {
			await page.goto('/rezervacie#dopyt', { waitUntil: 'domcontentloaded' });
			await expect(page.locator('#dopyt')).toBeVisible();
			await expect(page.getByRole('link', { name: site.phoneDisplay }).first()).toBeVisible();
		}
	});

	test('rýchle vyplnenie formulára bez submit crashu', async ({ page }) => {
		await page.goto('/rezervacie');
		const form = page.locator('#dopyt');

		for (let i = 0; i < 10; i++) {
			await form.locator('input[name="name"]').fill(`Stress Tester ${i}`);
			await form.locator('input[name="phone"]').fill('+421900000000');
			await form.locator('input[name="email"]').fill(`stress${i}@example.com`);
			await form.locator('input[name="place"]').fill('Bratislava');
			await expect(form.getByRole('button', { name: /Odoslať dopyt/i })).toBeEnabled();
		}
	});
});
