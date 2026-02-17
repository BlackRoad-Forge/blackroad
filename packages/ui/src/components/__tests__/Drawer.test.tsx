import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from '../Drawer';

describe('Drawer', () => {
  it('renders children when open', () => {
    render(
      <Drawer open onClose={() => {}}>
        <p>Drawer content</p>
      </Drawer>,
    );
    expect(screen.getByText('Drawer content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Drawer open onClose={() => {}} title="Settings">
        Content
      </Drawer>,
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('does not render title section when title is omitted', () => {
    const { container } = render(
      <Drawer open onClose={() => {}}>
        Content
      </Drawer>,
    );
    const titleDiv = container.querySelector('.border-b');
    expect(titleDiv).toBeNull();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Drawer open onClose={onClose}>
        Content
      </Drawer>,
    );
    const backdrop = container.querySelector('.bg-black\\/40');
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('defaults to side="right"', () => {
    const { container } = render(
      <Drawer open onClose={() => {}}>
        Content
      </Drawer>,
    );
    const panel = container.querySelector('.origin-right');
    expect(panel).not.toBeNull();
  });

  it.each(['left', 'right', 'top', 'bottom'] as const)(
    'applies correct origin class for side="%s"',
    (side) => {
      const { container } = render(
        <Drawer open onClose={() => {}} side={side}>
          Content
        </Drawer>,
      );
      expect(container.querySelector(`.origin-${side}`)).not.toBeNull();
    },
  );

  it('applies translate-x-0 when open (right side)', () => {
    const { container } = render(
      <Drawer open onClose={() => {}}>
        Content
      </Drawer>,
    );
    const panel = container.querySelector('.origin-right');
    expect(panel!.className).toContain('translate-x-0');
  });

  it('applies translate-x-full when closed (right side)', () => {
    const { container } = render(
      <Drawer open={false} onClose={() => {}}>
        Content
      </Drawer>,
    );
    const panel = container.querySelector('.origin-right');
    expect(panel!.className).toContain('translate-x-full');
  });
});
