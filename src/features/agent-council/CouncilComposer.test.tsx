import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useToolRuntimeStore } from '../tool-runtime/useToolRuntimeStore';
import { CouncilComposer } from './CouncilComposer';

describe('CouncilComposer', () => {
  beforeEach(() => useToolRuntimeStore.getState().reset());

  it('offers scenario, debate, build swarm, and research swarm modes', () => {
    render(<CouncilComposer />);
    expect(screen.getByRole('button', { name: /Scenario/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Debate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Build swarm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Research swarm/i })).toBeInTheDocument();
  });

  it('routes scenario work to MiroFish and debate work to AutoGen', () => {
    render(<CouncilComposer />);
    expect(screen.getByText(/MiroFish/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Debate/i }));
    expect(screen.getByText(/AutoGen/i)).toBeInTheDocument();
  });
});
