import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load landing page with premium branding', async ({ page }) => {
        // Verify Hero Section
        await expect(page.getByText('TitanFit V2.0')).toBeVisible();
        await expect(page.getByText('FORGE YOUR')).toBeVisible();
        await expect(page.getByText('LEGACY')).toBeVisible();

        // Verify CTA Buttons
        await expect(page.getByRole('link', { name: 'Commencer Maintenant' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Se Connecter' })).toBeVisible();
    });

    test('CTA buttons should navigate correctly', async ({ page }) => {
        await page.click('text=Commencer Maintenant');
        await expect(page).toHaveURL('/signup');

        await page.goto('/');
        await page.click('text=Se Connecter');
        await expect(page).toHaveURL('/login');
    });

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        await expect(page.getByText('FORGE YOUR')).toBeVisible();
        await expect(page.getByText('LEGACY')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Commencer Maintenant' })).toBeVisible();
    });
});

test.describe('Authentication Flow', () => {
    test('should display login page correctly', async ({ page }) => {
        await page.goto('/login');

        // Verify Branding
        await expect(page.getByText('TitanFit')).toBeVisible();
        await expect(page.getByText('Votre Voyage Fitness')).toBeVisible();

        // Verify Form
        await expect(page.getByRole('heading', { name: 'Bon retour' })).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Mot de passe')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
    });

    test('should navigate to signup from login', async ({ page }) => {
        await page.goto('/login');
        await page.click('text=Rejoindre l\'élite');
        await expect(page).toHaveURL('/signup');
    });

    test('should show validation errors on invalid attempt', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'wrong@email.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Expect error message
        await expect(page.getByText('Invalid login credentials')).toBeVisible({ timeout: 10000 });
    });

    // Note: skipping successful login test as it requires seeding a user
    // test('should login with valid credentials', async ({ page }) => { ... });
});

test.describe('Performance', () => {
    test('landing page should load quickly', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(3000);
    });
});
