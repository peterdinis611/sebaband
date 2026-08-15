import { expect, site, test } from './fixtures';

test.describe('Pätička a téma', () => {
	test('footer má kontakt a dopyt ide na rezervácie', async ({ page }) => {
		await page.goto('/');
		const footer = page.locator('footer');
		await expect(footer.getByRole('link', { name: site.phoneDisplay })).toBeVisible();
		await expect(footer.getByRole('link', { name: /Dopyt/i })).toHaveAttribute(
			'href',
			/\/rezervacie#dopyt/
		);
	});

	test('prepínač témy mení data-theme', async ({ page }) => {
		await page.goto('/');
		const html = page.locator('html');
		const before = await html.getAttribute('data-theme');
		await page.getByRole('button', { name: /režim/i }).click();
		await expect(html).not.toHaveAttribute('data-theme', before ?? '');
	});
});
