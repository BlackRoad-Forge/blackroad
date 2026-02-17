import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog } from '../Dialog';

describe('Dialog', () => {
  it('renders children and title when open', () => {
    render(
      <Dialog open onClose={() => {}} title="My Dialog">
        <p>Dialog body</p>
      </Dialog>,
    );
    expect(screen.getByText('My Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
  });

  it('sets aria-modal and role="dialog"', () => {
    render(
      <Dialog open onClose={() => {}}>
        Content
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose}>
        Content
      </Dialog>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={onClose}>
        Content
      </Dialog>,
    );
    // The backdrop is the absolute inset-0 div with bg-black/40
    const backdrop = container.querySelector('.bg-black\\/40');
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders footer when provided', () => {
    render(
      <Dialog open onClose={() => {}} footer={<button>OK</button>}>
        Body
      </Dialog>,
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    const { container } = render(
      <Dialog open onClose={() => {}}>
        Body
      </Dialog>,
    );
    // The footer wrapper has a border-t class
    const footerWrapper = container.querySelector('.border-t');
    expect(footerWrapper).toBeNull();
  });

  it('does not render title when not provided', () => {
    const { container } = render(
      <Dialog open onClose={() => {}}>
        Body
      </Dialog>,
    );
    // The title wrapper has a border-b class inside the panel
    const panels = container.querySelectorAll('.border-b');
    // Should have no title border-b inside the panel
    expect(panels.length).toBe(0);
  });

  it('applies pointer-events-auto when open', () => {
    render(
      <Dialog open onClose={() => {}}>
        Content
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('pointer-events-auto');
  });

  it('applies pointer-events-none when closed', () => {
    render(
      <Dialog open={false} onClose={() => {}}>
        Content
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('pointer-events-none');
  });
});
