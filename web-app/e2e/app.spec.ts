import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should navigate to login page', async ({ page }) => {
        await page.click('text=Connexion');
        await expect(page).toHaveURL('/login');
        await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
    });

    test('should show validation errors on empty submit', async ({ page }) => {
        await page.goto('/login');
        await page.click('button[type="submit"]');

        // HTML5 validation should trigger
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toHaveAttribute('required');
    });

    test('should login with valid credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill in credentials
        await page.fill('input[type="email"]', 'admin@titanfit.com');
        await page.fill('input[type="password"]', 'TestPassword123!');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for redirect to admin dashboard
        await page.waitForURL('/admin', { timeout: 10000 });

        // Verify we're on admin page
        await expect(page.getByText('Tableau de Bord')).toBeVisible();
    });

    test('should display error message with invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'wrong@email.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Wait for error message
        await expect(page.getByText(/invalid|incorrect/i)).toBeVisible({ timeout: 5000 });
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@titanfit.com');
        await page.fill('input[type="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin');

        // Logout
        await page.click('button:has-text("Déconnexion")');

        // Should redirect to home
        await page.waitForURL('/');
    });
});

test.describe('Landing Page', () => {
    test('should load landing page successfully', async ({ page }) => {
        await page.goto('/');

        // Verify hero section
        await expect(page.getByText(/TitanFit/i)).toBeVisible();

        // Verify Four Pillars section
        await expect(page.getByText('Les Quatre Piliers')).toBeVisible();
        await expect(page.getByText('Réseau Social')).toBeVisible();
        await expect(page.getByText('Analytics')).toBeVisible();
        await expect(page.getByText('IA de')).toBeVisible();
        await expect(page.getByText('Gamification')).toBeVisible();
    });

    test('should show transformation testimonial', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByText('Preuve de Transformation')).toBeVisible();
        await expect(page.getByText('-15kg')).toBeVisible();
        await expect(page.getByText('Alexandre M.')).toBeVisible();
    });

    test('CTA buttons should navigate correctly', async ({ page }) => {
        await page.goto('/');

        // Click "Améliorer Mon Entraînement" CTA
        await page.click('text=Améliorer Mon Entraînement');
        await expect(page).toHaveURL('/signup');
    });

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Verify content is visible on mobile
        await expect(page.getByText(/TitanFit/i)).toBeVisible();
        await expect(page.getByText('Les Quatre Piliers')).toBeVisible();
    });
});

test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/login');
        await page.fill('input[type="email"]', 'admin@titanfit.com');
        await page.fill('input[type="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('/admin');
    });

    test('should display dashboard stats', async ({ page }) => {
        await expect(page.getByText('Utilisateurs Total')).toBeVisible();
        await expect(page.getByText('Produits Actifs')).toBeVisible();
        await expect(page.getByText('Commandes')).toBeVisible();
        await expect(page.getByText('Revenus')).toBeVisible();
    });

    test('Quick Actions should navigate correctly', async ({ page }) => {
        // Click Users quick action
        await page.click('text=Gérer les Utilisateurs');
        await page.waitForURL('/admin/users');
        await expect(page.getByText('Utilisateurs')).toBeVisible();
    });

    test('should navigate to settings page', async ({ page }) => {
        await page.goto('/admin/settings');
        await expect(page.getByText('Paramètres Système')).toBeVisible();
        await expect(page.getByText('Informations Générales')).toBeVisible();
    });
});

test.describe('Performance', () => {
    test('landing page should load quickly', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        const loadTime = Date.now() - startTime;

        // Should load in under 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });

    test('should not have console errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/');

        // Filter out known acceptable errors
        const criticalErrors = errors.filter(err =>
            !err.includes('favicon') &&
            !err.includes('sourcemap')
        );

        expect(criticalErrors).toHaveLength(0);
    });
});
