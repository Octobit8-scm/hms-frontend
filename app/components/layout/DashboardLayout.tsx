'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { roleConfig } from '@/app/config/rbac';
import Logo from '../ui/Logo';
import Icon from '../ui/Icon';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace('/');
      return;
    }

    // Check if user is trying to access a route they're not allowed to
    const userRoutes = roleConfig[user.role]?.routes || [];
    const isAllowedRoute = userRoutes.some(route => pathname.startsWith(route));
    
    if (!isAllowedRoute) {
      // Redirect to their default dashboard
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, router, pathname]);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  // Don't render the layout if there's no user
  if (!user) {
    return null;
  }

  const navigation = roleConfig[user.role]?.navigation || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="w-48 flex-shrink-0">
            <Logo size="sm" showText={true} />
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 truncate max-w-[200px]">{user?.email}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm rounded-lg p-4 h-[calc(100vh-7rem)]">
          <div className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex w-full items-center gap-2 p-2 rounded-md hover:bg-gray-50 ${
                  pathname === item.href ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                }`}
              >
                <Icon name={item.icon} size={24} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-white shadow-sm rounded-lg p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 