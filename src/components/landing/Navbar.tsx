import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* Add Logo Here if available, otherwise text */}
          <span className="font-bold sm:inline-block text-xl">BarakahBot</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
          >
            Home
          </Link>
          <Link
            href="/zakatbot" // Assuming a ZakatBot page route
            className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
          >
            ZakatBot
          </Link>
          <Link
            href="/campaigns" // Assuming a Campaigns page route
            className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
          >
            Campaigns
          </Link>
          <Link
            href="/dashboard" // Assuming a Dashboard page route
            className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
          >
            Dashboard
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 