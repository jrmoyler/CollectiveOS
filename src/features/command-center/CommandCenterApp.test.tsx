import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CommandCenterApp } from './CommandCenterApp';

describe('CommandCenterApp', () => {
  it.each([
    ['cockpit', 'Founder Cockpit'],
    ['portfolio', 'Collective AI Mission Control'],
    ['council', 'Agent Council'],
    ['tools', 'Tool Forge'],
  ] as const)('renders the %s mode', (mode, heading) => {
    render(<CommandCenterApp mode={mode} />);
    expect(screen.getByRole('heading', { name: new RegExp(heading, 'i') })).toBeInTheDocument();
  });
});
