import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('defaults to variant="plain"', () => {
    render(<Card>Plain</Card>);
    const card = screen.getByText('Plain').closest('div')!;
    expect(card.className).toContain('bg-white');
    expect(card.className).not.toContain('shadow-lg');
  });

  it('applies outlined variant styles', () => {
    render(<Card variant="outlined">Outlined</Card>);
    const card = screen.getByText('Outlined').closest('div')!;
    expect(card.className).toContain('bg-transparent');
  });

  it('applies elevated variant styles with shadow', () => {
    render(<Card variant="elevated">Elevated</Card>);
    const card = screen.getByText('Elevated').closest('div')!;
    expect(card.className).toContain('shadow-lg');
  });

  it('merges custom className', () => {
    render(<Card className="my-class">Custom</Card>);
    const card = screen.getByText('Custom').closest('div')!;
    expect(card.className).toContain('my-class');
  });

  it('forwards native div attributes', () => {
    render(<Card data-testid="my-card">Test</Card>);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });
});
