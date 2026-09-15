import { expect, test } from '@playwright/test';

test('wrappers subnav lists accordion from manifest routes', async ({ page }) => {
	await page.goto('/wrappers');
	await expect(page.getByRole('link', { name: 'Accordion' })).toBeVisible();
});
