import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when the label prop is provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    // label should be linked to the input
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('does not render a label when label is omitted', () => {
    const { container } = render(<Input />);
    expect(container.querySelector('label')).toBeNull();
  });

  it('defaults to variant="default" with gray border', () => {
    render(<Input />);
    expect(screen.getByRole('textbox').className).toContain('border-gray-300');
  });

  it.each([
    ['danger', 'border-danger'],
    ['success', 'border-success'],
    ['warning', 'border-warning'],
  ] as const)('applies correct class for variant="%s"', (variant, expectedClass) => {
    render(<Input variant={variant} />);
    expect(screen.getByRole('textbox').className).toContain(expectedClass);
  });

  it('forwards native input attributes', () => {
    render(<Input placeholder="Enter email" type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('uses provided id for label binding', () => {
    render(<Input label="Name" id="name-field" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'name-field');
    expect(screen.getByText('Name')).toHaveAttribute('for', 'name-field');
  });
});
