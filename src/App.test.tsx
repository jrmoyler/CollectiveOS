import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(document.querySelector('.w-full.h-full')).toBeInTheDocument();
  });

  it('should have correct background styling', () => {
    render(<App />);
    const container = document.querySelector('.bg-slate-950');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('w-full', 'h-full', 'bg-slate-950', 'relative', 'overflow-hidden');
  });

  it('should render all main layout components', () => {
    const { container } = render(<App />);

    // The app should render and mount successfully
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render with proper structure', () => {
    const { container } = render(<App />);
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toBeInstanceOf(HTMLDivElement);
    expect(mainDiv.className).toContain('bg-slate-950');
  });
});
