import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboardPage from './page';

describe('AdminDashboardPage', () => {
  it('renders dashboard heading', () => {
    render(<AdminDashboardPage />);

    expect(screen.getByRole('heading', { name: /dashboard/i, level: 1 })).toBeInTheDocument();
  });

  it('renders stats cards section', () => {
    render(<AdminDashboardPage />);

    expect(screen.getByText(/total revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/total orders/i)).toBeInTheDocument();
    expect(screen.getByText(/active vendors/i)).toBeInTheDocument();
    expect(screen.getByText(/total customers/i)).toBeInTheDocument();
  });

  it('renders recent orders section', () => {
    render(<AdminDashboardPage />);

    expect(screen.getByRole('heading', { name: /recent orders/i })).toBeInTheDocument();
  });

  it('renders pending vendor approvals section', () => {
    render(<AdminDashboardPage />);

    expect(screen.getByRole('heading', { name: /pending vendor approvals/i })).toBeInTheDocument();
  });
});
