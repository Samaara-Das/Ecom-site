import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminHeader } from './AdminHeader';

describe('AdminHeader', () => {
  it('renders header element with banner role', () => {
    render(<AdminHeader />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<AdminHeader />);

    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder');
  });

  it('renders user menu button', () => {
    render(<AdminHeader />);

    const userButton = screen.getByRole('button', { name: /user menu/i });
    expect(userButton).toBeInTheDocument();
  });

  it('renders notifications button', () => {
    render(<AdminHeader />);

    const notificationsButton = screen.getByRole('button', { name: /notifications/i });
    expect(notificationsButton).toBeInTheDocument();
  });
});
