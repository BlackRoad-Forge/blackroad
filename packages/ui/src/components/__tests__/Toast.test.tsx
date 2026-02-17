import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('displays the message when open', () => {
    render(<Toast open message="Hello!" />);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('has role="status" for accessibility', () => {
    render(<Toast open message="Info" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('calls onClose after duration milliseconds', () => {
    const onClose = vi.fn();
    render(<Toast open message="Auto-close" duration={2000} onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2000);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('defaults to 3000ms duration', () => {
    const onClose = vi.fn();
    render(<Toast open message="Default" onClose={onClose} />);

    vi.advanceTimersByTime(2999);
    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not auto-dismiss when duration is 0', () => {
    const onClose = vi.fn();
    render(<Toast open message="Sticky" duration={0} onClose={onClose} />);

    vi.advanceTimersByTime(10000);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not auto-dismiss when not open', () => {
    const onClose = vi.fn();
    render(<Toast open={false} message="Hidden" onClose={onClose} />);

    vi.advanceTimersByTime(5000);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<Toast open message="Closeable" onClose={onClose} />);

    const closeBtn = screen.getByLabelText('Close toast');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('defaults to variant="info"', () => {
    render(<Toast open message="Info" />);
    const status = screen.getByRole('status');
    const inner = status.firstElementChild!;
    expect(inner.className).toContain('bg-info');
  });

  it.each([
    ['info', 'bg-info'],
    ['success', 'bg-success'],
    ['warning', 'bg-warning'],
    ['danger', 'bg-danger'],
  ] as const)('applies correct class for variant="%s"', (variant, expectedClass) => {
    render(<Toast open message="V" variant={variant} />);
    const inner = screen.getByRole('status').firstElementChild!;
    expect(inner.className).toContain(expectedClass);
  });

  it('applies translate-y-0 when open and translate-y-full when closed', () => {
    const { rerender } = render(<Toast open message="Slide" />);
    expect(screen.getByRole('status').className).toContain('translate-y-0');

    rerender(<Toast open={false} message="Slide" />);
    expect(screen.getByRole('status').className).toContain('translate-y-full');
  });
});
