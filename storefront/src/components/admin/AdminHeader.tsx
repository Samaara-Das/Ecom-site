'use client';

import { Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6" role="banner">
      {/* Search */}
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search orders, vendors, products..."
            className={cn(
              'w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm',
              'placeholder:text-gray-400',
              'focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className={cn(
            'relative rounded-lg p-2 text-gray-600',
            'hover:bg-gray-100 hover:text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
        >
          <Bell className="h-5 w-5" />
          {/* Notification badge */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User menu */}
        <button
          type="button"
          aria-label="User menu"
          className={cn(
            'flex items-center gap-2 rounded-lg p-2 text-gray-600',
            'hover:bg-gray-100 hover:text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-medium md:inline">Admin</span>
        </button>
      </div>
    </header>
  );
}
