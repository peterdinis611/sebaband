import { expect, site, test } from './fixtures';

test.describe('Rezervácie', () => {
	test('má kalendár a formulár dopytu', async ({ page }) => {
		await page.goto('/rezervacie');
		await expect(page.locator('#dopyt')).toBeVisible();
		await expect(page.getByRole('heading', { name: /Napíšte nám/i })).toBeVisible();
		await expect(page.getByRole('link', { name: site.phoneDisplay }).first()).toBeVisible();
	});

	test('hash #dopyt scrollne na formulár', async ({ page }) => {
		await page.goto('/rezervacie#dopyt');
		await expect(page.locator('#dopyt')).toBeInViewport();
	});

	test('formulár má povinné polia', async ({ page }) => {
		await page.goto('/rezervacie');
		const form = page.locator('#dopyt');
		await expect(form.locator('input[name="name"]')).toBeVisible();
		await expect(form.locator('input[name="phone"]')).toBeVisible();
		await expect(form.locator('input[name="email"]')).toBeVisible();
		await expect(form.getByRole('button', { name: /Odoslať dopyt/i })).toBeVisible();
	});

	test('prázdny dopyt ukáže validačné chyby', async ({ page }) => {
		await page.goto('/rezervacie');
		const form = page.locator('#dopyt');
		await form.getByRole('button', { name: /Odoslať dopyt/i }).click();
		await expect(form.getByRole('alert')).toBeVisible();
		await expect(form.getByText(/Zadajte meno/i)).toBeVisible();
		await expect(form.getByText(/telefón/i).first()).toBeVisible();
	});

	test('neplatný e-mail a telefón sa zachytia', async ({ page }) => {
		await page.goto('/rezervacie');
		const form = page.locator('#dopyt');
		await form.locator('input[name="name"]').fill('Peter Test');
		await form.locator('input[name="phone"]').fill('123');
		await form.locator('input[name="email"]').fill('nie-email');
		await form.locator('input[name="place"]').fill('Košice');
		await form.locator('input[name="date"]').fill('2026-08-16');
		await form.getByRole('button', { name: /Odoslať dopyt/i }).click();
		await expect(form.getByText(/platné číslo/i)).toBeVisible();
		await expect(form.getByText(/platný e-mail/i)).toBeVisible();
	});
});
