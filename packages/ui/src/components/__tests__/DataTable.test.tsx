import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable } from '../DataTable';

type Person = { name: string; age: number };

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'age' as const, header: 'Age' },
];

const data: Person[] = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
];

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders the correct number of rows', () => {
    const { container } = render(<DataTable columns={columns} data={data} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
  });

  it('renders cell values from data', () => {
    render(<DataTable columns={columns} data={data} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('uses custom render function when provided', () => {
    const customColumns = [
      {
        key: 'name' as const,
        header: 'Name',
        render: (row: Person) => <strong>{row.name.toUpperCase()}</strong>,
      },
      { key: 'age' as const, header: 'Age' },
    ];
    render(<DataTable columns={customColumns} data={data} />);
    expect(screen.getByText('ALICE')).toBeInTheDocument();
  });

  it('renders empty body when data is empty', () => {
    const { container } = render(<DataTable columns={columns} data={[]} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(0);
  });

  it('applies center alignment class', () => {
    const centeredColumns = [
      { key: 'name' as const, header: 'Name', align: 'center' as const },
    ];
    const { container } = render(
      <DataTable columns={centeredColumns} data={[{ name: 'Test', age: 1 }]} />,
    );
    const th = container.querySelector('th');
    expect(th!.className).toContain('text-center');
    const td = container.querySelector('td');
    expect(td!.className).toContain('text-center');
  });

  it('applies right alignment class', () => {
    const rightColumns = [
      { key: 'age' as const, header: 'Age', align: 'right' as const },
    ];
    const { container } = render(
      <DataTable columns={rightColumns} data={[{ name: 'Test', age: 1 }]} />,
    );
    const th = container.querySelector('th');
    expect(th!.className).toContain('text-right');
  });

  it('merges custom className on the wrapper', () => {
    const { container } = render(
      <DataTable columns={columns} data={data} className="my-table" />,
    );
    expect(container.firstElementChild!.className).toContain('my-table');
  });
});
