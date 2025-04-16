'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const pathname = usePathname();
  
  // Navigation items with their paths
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'ZakatBot', path: '/zakatbot' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Dashboard', path: '/dashboard' },
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

        <div>
          <Button variant="ghost" className="text-brand-dark-green font-medium" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 