import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../auth-context';
import { supabase } from '@/lib/supabase';
import { act } from 'react-dom/test-utils';

function TestComponent() {
    const { user, loading, signIn } = useAuth();
    if (loading) return <div data-testid="loading">Loading...</div>;
    return (
        <div>
            <div data-testid="user">{user ? user.email : 'no user'}</div>
            <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
        </div>
    );
}

describe('AuthProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock getSession to return no session by default
        (supabase.auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: null },
            error: null
        });

        // Mock onAuthStateChange
        (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
            data: { subscription: { unsubscribe: jest.fn() } }
        });
    });

    it('provides auth state to children', async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
            expect(screen.getByTestId('user')).toHaveTextContent('no user');
        });
    });

    it('loads session on mount', async () => {
        const mockUser = { id: '123', email: 'test@example.com' };
        (supabase.auth.getSession as jest.Mock).mockResolvedValue({
            data: { session: { user: mockUser } },
            error: null
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
        });
    });

    it('updates state when signIn is called', async () => {
        (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
            data: { user: { email: 'test@example.com' } },
            error: null
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => screen.getByTestId('user'));

        screen.getByText('Sign In').click();

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password'
            });
        });
    });
});
