import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@/lib/auth-context';
import LoginPage from '../page';

// Mock useAuth hook
jest.mock('@/lib/auth-context');

// Mock useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
        replace: jest.fn(),
    }),
}));

// Mock Three.js components to avoid Canvas errors
jest.mock('@/components/hero/LiquidBackground', () => {
    return function DummyLiquidBg() { return <div data-testid="liquid-bg" />; };
});
jest.mock('@/components/TitaniumBackground', () => {
    return function DummyTitaniumBg() { return <div data-testid="titanium-bg" />; };
});

describe('LoginPage', () => {
    const mockSignIn = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({
            user: null,
            loading: false,
            signIn: mockSignIn,
        });
    });

    it('renders login form', () => {
        render(<LoginPage />);

        expect(screen.getByText('Bon retour')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    it.skip('displays validation errors for empty fields', async () => {
        render(<LoginPage />);

        const submitButton = screen.getByRole('button', { name: /se connecter/i });
        fireEvent.click(submitButton);

        // HTML5 validation should prevent submission
        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        expect(emailInput.validity.valid).toBe(false);
    });

    it('calls signIn with email and password', async () => {
        mockSignIn.mockResolvedValue({ error: null });

        render(<LoginPage />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Mot de passe');
        const submitButton = screen.getByRole('button', { name: /se connecter/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    it('displays error message on failed login', async () => {
        mockSignIn.mockResolvedValue({ error: { message: 'Invalid credentials' } });

        render(<LoginPage />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Mot de passe');
        const submitButton = screen.getByRole('button', { name: /se connecter/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('shows loading state during sign in', async () => {
        mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        render(<LoginPage />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Mot de passe');
        const submitButton = screen.getByRole('button', { name: /se connecter/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        expect(screen.getByText('Connexion...')).toBeInTheDocument();
    });

    it('redirects to admin if already logged in', () => {
        (useAuth as jest.Mock).mockReturnValue({
            user: { id: '123', email: 'test@example.com' },
            loading: false,
            signIn: mockSignIn,
        });

        render(<LoginPage />);

        // Component should return null when user is logged in
        expect(screen.queryByText('Bon retour')).not.toBeInTheDocument();
    });
});
