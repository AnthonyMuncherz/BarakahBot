/**
 * Footer Component
 * 
 * The website footer containing branding, copyright information, and social links.
 * Features a responsive layout and dynamic year display.
 * Uses Lucide icons for social media links.
 * 
 * Components:
 * - Link: Next.js link component for navigation
 * - Lucide Icons: Instagram, Twitter, Send, Youtube, Copyright
 * 
 * Features:
 * - Responsive layout (switches between column and row)
 * - Dynamic copyright year
 * - Social media links with hover effects
 * - Consistent branding with main site
 * 
 * Visual Elements:
 * - Border top for separation
 * - Muted text colors for secondary information
 * - Hover effects on interactive elements
 * - Proper spacing and alignment
 * 
 * Props: None
 */

import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Send, Youtube, Copyright } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="container max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left Side: Brand and Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="text-2xl font-bold mb-2">
            BarakahBot
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Copyright className="w-4 h-4" />
            <span>BarakahBot {new Date().getFullYear()}. All right reserved</span>
          </div>
        </div>

        {/* Middle: Quick Links */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
            About Us
          </Link>
          <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
          <Link href="/zakatbot" className="text-muted-foreground hover:text-primary transition-colors">
            Calculate Zakat
          </Link>
        </div>

        {/* Right Side: Social Links */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <h3 className="font-semibold text-lg mb-2">Connect With Us</h3>
          <div className="flex gap-4 text-muted-foreground">
            <Link href="#" aria-label="Instagram" className="hover:text-primary">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-primary">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="Telegram" className="hover:text-primary">
              <Send className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="YouTube" className="hover:text-primary">
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 