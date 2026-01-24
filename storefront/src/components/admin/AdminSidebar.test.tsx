import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminSidebar } from './AdminSidebar';

describe('AdminSidebar', () => {
  it('renders navigation with admin label', () => {
    render(<AdminSidebar />);

    expect(screen.getByRole('navigation', { name: /admin/i })).toBeInTheDocument();
  });

  it('renders dashboard link', () => {
    render(<AdminSidebar />);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/admin');
  });

  it('renders vendors management link', () => {
    render(<AdminSidebar />);

    const vendorsLink = screen.getByRole('link', { name: /vendors/i });
    expect(vendorsLink).toBeInTheDocument();
    expect(vendorsLink).toHaveAttribute('href', '/admin/vendors');
  });

  it('renders orders link', () => {
    render(<AdminSidebar />);

    const ordersLink = screen.getByRole('link', { name: /orders/i });
    expect(ordersLink).toBeInTheDocument();
    expect(ordersLink).toHaveAttribute('href', '/admin/orders');
  });

  it('renders products link', () => {
    render(<AdminSidebar />);

    const productsLink = screen.getByRole('link', { name: /products/i });
    expect(productsLink).toBeInTheDocument();
    expect(productsLink).toHaveAttribute('href', '/admin/products');
  });

  it('renders customers link', () => {
    render(<AdminSidebar />);

    const customersLink = screen.getByRole('link', { name: /customers/i });
    expect(customersLink).toBeInTheDocument();
    expect(customersLink).toHaveAttribute('href', '/admin/customers');
  });

  it('renders analytics link', () => {
    render(<AdminSidebar />);

    const analyticsLink = screen.getByRole('link', { name: /analytics/i });
    expect(analyticsLink).toBeInTheDocument();
    expect(analyticsLink).toHaveAttribute('href', '/admin/analytics');
  });

  it('renders settings link', () => {
    render(<AdminSidebar />);

    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute('href', '/admin/settings');
  });

  it('renders marketplace logo/brand', () => {
    render(<AdminSidebar />);

    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });
});
