import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IntelligenceShell } from './IntelligenceShell';

const navigation = [
  { id: 'cockpit', label: 'Founder Cockpit' },
  { id: 'tools', label: 'Tool Forge' },
];

describe('IntelligenceShell', () => {
  it('renders operational, context, analysis, and intelligence regions', () => {
    render(
      <IntelligenceShell
        activeSection="cockpit"
        navigation={navigation}
        onNavigate={vi.fn()}
        context={<div>Mission context</div>}
        analysis={<h1>Founder Cockpit</h1>}
        intelligence={<div>Intelligence drawer</div>}
      />,
    );

    expect(screen.getByLabelText('Operational navigation')).toBeInTheDocument();
    expect(screen.getByText('Mission context')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Founder Cockpit' })).toBeInTheDocument();
    expect(screen.getByText('Intelligence drawer')).toBeInTheDocument();
    expect(screen.getByText(/Execution node/i)).toBeInTheDocument();
  });

  it('opens the command palette with Control K', () => {
    render(
      <IntelligenceShell
        activeSection="cockpit"
        navigation={navigation}
        onNavigate={vi.fn()}
        context={<div />}
        analysis={<div />}
        intelligence={<div />}
      />,
    );

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: /Command palette/i })).toBeInTheDocument();
  });
});
