import { render, screen } from '@testing-library/react';
import { GlassCard } from '../GlassCard';

describe('GlassCard', () => {
    it('renders children correctly', () => {
        render(
            <GlassCard>
                <div data-testid="child">Test Content</div>
            </GlassCard>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies default classes', () => {
        const { container } = render(<GlassCard>Content</GlassCard>);
        const div = container.firstChild as HTMLElement;

        expect(div).toHaveClass('relative', 'overflow-hidden', 'rounded-2xl', 'border', 'border-white/10', 'backdrop-blur-xl', 'bg-black/40');
    });

    it('applies gradient class when gradient prop is true', () => {
        const { container } = render(<GlassCard gradient>Content</GlassCard>);
        const div = container.firstChild as HTMLElement;

        expect(div).toHaveClass('bg-gradient-to-br', 'from-white/5', 'to-white/0');
    });

    it('does not apply hover classes when hoverEffect is false', () => {
        const { container } = render(<GlassCard hoverEffect={false}>Content</GlassCard>);
        const div = container.firstChild as HTMLElement;

        expect(div).not.toHaveClass('hover:border-white/20');
        expect(div).not.toHaveClass('hover:-translate-y-1');
    });

    it('removes padding when noPadding prop is true', () => {
        const { container } = render(<GlassCard noPadding>Content</GlassCard>);
        const div = container.firstChild as HTMLElement;

        expect(div).not.toHaveClass('p-6');
    });

    it('merges custom className', () => {
        const { container } = render(<GlassCard className="custom-class">Content</GlassCard>);
        const div = container.firstChild as HTMLElement;

        expect(div).toHaveClass('custom-class');
    });
});
