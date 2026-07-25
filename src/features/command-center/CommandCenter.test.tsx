import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CommandCenter } from './CommandCenter';

describe('CommandCenter', () => {
  it('renders the founder cockpit and official Collective AI portfolio', () => {
    render(<CommandCenter onOpenApp={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /Founder Cockpit/i })).toBeInTheDocument();
    expect(screen.getByText('Kre8trix Platform')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Orchestrate with Council/i }).length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole('button', { name: /Collective Portfolio/i })[0]);
    expect(screen.getByText('Exclusive Essence')).toBeInTheDocument();
  });

  it('filters the unified search across tools and projects', () => {
    render(<CommandCenter onOpenApp={vi.fn()} />);

    fireEvent.change(screen.getByRole('searchbox', { name: /Search everything/i }), {
      target: { value: 'MiroFish' },
    });

    expect(screen.getByRole('button', { name: /MiroFish Agent Council/i })).toBeInTheDocument();
  });

  it('opens Agent Council from the primary command action', () => {
    const onOpenApp = vi.fn();
    render(<CommandCenter onOpenApp={onOpenApp} />);

    fireEvent.click(screen.getAllByRole('button', { name: /Orchestrate with Council/i })[0]);
    expect(onOpenApp).toHaveBeenCalledWith('agent-council');
  });

  it('navigates to Tool Forge from a responsive navigation control', () => {
    render(<CommandCenter onOpenApp={vi.fn()} />);

    fireEvent.click(screen.getAllByRole('button', { name: /^Tool Forge$/i })[0]);
    expect(screen.getByRole('heading', { name: /Open-source Tool Forge/i })).toBeInTheDocument();
  });
});
