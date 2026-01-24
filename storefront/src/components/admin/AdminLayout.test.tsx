import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminLayout } from './AdminLayout';

describe('AdminLayout', () => {
  it('renders children content', () => {
    render(
      <AdminLayout>
        <div data-testid="child-content">Test Content</div>
      </AdminLayout>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders sidebar navigation', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    expect(screen.getByRole('navigation', { name: /admin/i })).toBeInTheDocument();
  });

  it('renders header with admin title', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('has proper layout structure with sidebar and main content area', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    );

    // Should have aside element for sidebar
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    // Should have main element for content
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
