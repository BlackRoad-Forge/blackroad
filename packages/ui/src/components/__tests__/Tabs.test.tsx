import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../Tabs';

const sampleTabs = [
  { id: 'a', title: 'Alpha', content: <p>Alpha content</p> },
  { id: 'b', title: 'Beta', content: <p>Beta content</p> },
  { id: 'c', title: 'Gamma', content: <p>Gamma content</p> },
];

describe('Tabs', () => {
  it('renders all tab buttons', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('shows the first tab content by default', () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByText('Alpha content')).toBeInTheDocument();
  });

  it('switches content when a different tab is clicked', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} />);

    await user.click(screen.getByText('Beta'));
    expect(screen.getByText('Beta content')).toBeInTheDocument();
  });

  it('respects defaultTabId', () => {
    render(<Tabs tabs={sampleTabs} defaultTabId="c" />);
    expect(screen.getByText('Gamma content')).toBeInTheDocument();
  });

  it('applies active styling to the selected tab button', () => {
    render(<Tabs tabs={sampleTabs} />);
    const alphaBtn = screen.getByText('Alpha');
    expect(alphaBtn.className).toContain('border-primary');
  });

  it('removes active styling from unselected tabs', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={sampleTabs} />);

    await user.click(screen.getByText('Beta'));
    const alphaBtn = screen.getByText('Alpha');
    expect(alphaBtn.className).toContain('border-transparent');
  });
});
