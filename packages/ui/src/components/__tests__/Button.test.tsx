import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('defaults to variant="primary" and size="md"', () => {
    render(<Button>Default</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-primary');
    expect(btn.className).toContain('px-4');
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
    ['outline', 'bg-transparent'],
  ] as const)('applies correct class for variant="%s"', (variant, expectedClass) => {
    render(<Button variant={variant}>Btn</Button>);
    expect(screen.getByRole('button').className).toContain(expectedClass);
  });

  it.each([
    ['sm', 'px-3'],
    ['md', 'px-4'],
    ['lg', 'px-5'],
  ] as const)('applies correct class for size="%s"', (size, expectedClass) => {
    render(<Button size={size}>Btn</Button>);
    expect(screen.getByRole('button').className).toContain(expectedClass);
  });

  it('forwards native button attributes', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled type="submit">
        Submit
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('merges custom className', () => {
    render(<Button className="my-custom-class">Btn</Button>);
    expect(screen.getByRole('button').className).toContain('my-custom-class');
  });
});
