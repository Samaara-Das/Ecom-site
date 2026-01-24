'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Vendors',
    href: '/admin/vendors',
    icon: <Store className="h-5 w-5" />,
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: 'Customers',
    href: '/admin/customers',
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function AdminSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white" role="complementary">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
          <Store className="h-6 w-6 text-blue-600" />
          <span>Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4" aria-label="Admin navigation">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors',
                  'hover:bg-gray-100 hover:text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-gray-500">Kuwait Marketplace Admin</p>
        <p className="text-xs text-gray-400">v1.0.0</p>
      </div>
    </aside>
  );
}
