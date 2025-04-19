'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Send, Youtube, Copyright } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-[#fdfaf5] py-12 px-6">
      <div className="container max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Brand & Copyright */}
        <div>
          <Link href="/" className="text-2xl font-bold text-[#2c5c4b]">
            BarakahBot
          </Link>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Copyright className="w-4 h-4" />
            <span>BarakahBot {new Date().getFullYear()}. All rights reserved.</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg text-[#2c5c4b] mb-3">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="/zakatbot" className="hover:text-primary">Calculate Zakat</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg text-[#2c5c4b] mb-3">Connect With Us</h3>
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

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-lg text-[#2c5c4b] mb-3">Subscribe to Newsletter</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Get the latest updates and campaigns.
          </p>
          <form className="flex w-full max-w-sm">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-[#2c5c4b] text-white px-4 py-2 rounded-r-md hover:bg-[#244b3d] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>
    </footer>
  );
};

export default Footer;