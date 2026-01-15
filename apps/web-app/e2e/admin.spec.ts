import { test, expect } from '@playwright/test';

test.describe('Admin Panel Security', () => {
    test('guest should be redirected from admin dashboard', async ({ page }) => {
        await page.goto('/admin');

        // Should redirect to login or stay restricted
        // Depending on middleware implementation, it might show 404, redirect to login, or show a custom forbidden page
        // Let's assume it redirects to /login for now based on standard web-app behavior
        await expect(page).toHaveURL(/\/login/);
    });

    test('guest should not be able to access CMS management directly', async ({ page }) => {
        await page.goto('/admin/pages');
        await expect(page).toHaveURL(/\/login/);
    });
});

test.describe('Admin Content Management (Mocked/Static UI)', () => {
    // These tests focus on UI elements visibility when the components are rendered
    // In a real E2E with Auth, we would login first.

    test('admin login page matches branding', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByText('Bon retour')).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });
});
