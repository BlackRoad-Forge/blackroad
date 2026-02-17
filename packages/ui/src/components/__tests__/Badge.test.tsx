import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('defaults to variant="primary" and size="md"', () => {
    render(<Badge>Tag</Badge>);
    const badge = screen.getByText('Tag');
    expect(badge.className).toContain('bg-primary');
    expect(badge.className).toContain('px-2.5');
  });

  it.each([
    ['primary', 'bg-primary'],
    ['secondary', 'bg-secondary'],
    ['accent', 'bg-accent'],
    ['neutral', 'bg-neutral'],
    ['info', 'bg-info'],
    ['danger', 'bg-danger'],
    ['warning', 'bg-warning'],
    ['success', 'bg-success'],
  ] as const)('applies correct class for variant="%s"', (variant, expectedClass) => {
    render(<Badge variant={variant}>V</Badge>);
    expect(screen.getByText('V').className).toContain(expectedClass);
  });

  it.each([
    ['sm', 'text-xs'],
    ['md', 'text-sm'],
    ['lg', 'text-base'],
  ] as const)('applies correct class for size="%s"', (size, expectedClass) => {
    render(<Badge size={size}>S</Badge>);
    expect(screen.getByText('S').className).toContain(expectedClass);
  });

  it('renders as a span element', () => {
    const { container } = render(<Badge>X</Badge>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Badge className="extra">E</Badge>);
    expect(screen.getByText('E').className).toContain('extra');
  });
});
