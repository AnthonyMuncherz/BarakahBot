import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-xl mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-xl text-brand-dark-green">BarakahBot</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="font-medium text-brand-dark-green hover:text-brand-dark-green/80"
          >
            Home
          </Link>
          <Link
            href="/zakatbot"
            className="font-medium text-brand-dark-green/70 hover:text-brand-dark-green"
          >
            ZakatBot
          </Link>
          <Link
            href="/campaigns"
            className="font-medium text-brand-dark-green/70 hover:text-brand-dark-green"
          >
            Campaigns
          </Link>
          <Link
            href="/dashboard"
            className="font-medium text-brand-dark-green/70 hover:text-brand-dark-green"
          >
            Dashboard
          </Link>
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