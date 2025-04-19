/**
 * Navbar Component
 *
 * The main navigation bar for BarakahBot, featuring responsive design and authentication state.
 * Displays different navigation items and buttons based on user authentication status.
 * Uses the AuthContext for user state management.
 *
 * Components:
 * - Button: UI component for action buttons
 * - Skeleton: Loading state placeholder
 * - Link: Next.js link component for navigation
 *
 * Features:
 * - Responsive navigation with mobile support
 * - Dynamic navigation items based on auth state
 * - Active link highlighting
 * - Loading state handling
 * - Sticky positioning with backdrop blur
 *
 * Context:
 * - useAuth: Provides user authentication state and functions
 *
 * Navigation Items:
 * - Base: Home, ZakatBot, Campaigns, About Us
 * - Authenticated: Adds Dashboard
 * - Auth Buttons: Login/Register or Welcome/Logout
 *
 * Props: None
 */

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

const Navbar = () => {
  const pathname = usePathname();
  const { user, logout, isLoading, fetchUser } = useAuth();

  useEffect(() => {
    // Ensure the user is fetched on navbar mount
    fetchUser?.();
  }, [fetchUser]);

  const baseNavItems = [
    { name: 'Home', path: '/' },
    { name: 'ZakatBot', path: '/zakatbot' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'About Us', path: '/about' },
  ];

  const navItems = [
    ...baseNavItems,
    ...(user ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-xl text-brand-dark-green">BarakahBot</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => {
            if (item.path === '/dashboard' && isLoading) return null;
            if (item.path === '/dashboard' && !user) return null;

            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#1A4D2E] text-white' 
                    : 'text-brand-dark-green/70 hover:text-brand-dark-green hover:bg-brand-light-green/20'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2">
          {isLoading ? (
            <>
              <Skeleton className="h-9 w-16 rounded-md" /> 
              <Skeleton className="h-9 w-20 rounded-md" />
            </>
          ) : user ? (
            <>
              {user.name && (
                <span className="text-sm text-muted-foreground hidden sm:inline mr-2">
                  Welcome, {user.name}!
                </span>
              )}
              <Button variant="ghost" onClick={logout} className="text-brand-dark-green font-medium">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-brand-dark-green font-medium" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
