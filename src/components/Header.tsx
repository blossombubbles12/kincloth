'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, Heart, Search, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useFavourites } from '@/lib/favourites-context';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'New', href: '/new' },
  { label: 'Watch', href: '/reels' },
  { label: 'Track', href: '/track-order' },
  { label: 'About', href: '/about' },
];

export const Header = () => {
  const { setIsCartOpen, itemCount } = useCart();
  const { count: favCount } = useFavourites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-[60] border-b-[3px] border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-6">
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 neo-border bg-[var(--card)] hover:bg-[var(--accent)] transition-colors active:translate-y-0.5"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <span className="text-xl md:text-2xl font-black tracking-tighter group-hover:bg-[var(--accent)] group-hover:text-black transition-colors px-1">KINCLOTH</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 hover:bg-[var(--accent)] hover:text-black transition-colors border-2 border-transparent hover:border-[var(--border)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Search — Desktop center-ish */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <SearchBar />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 neo-border bg-[var(--card)] hover:bg-[var(--accent)] transition-colors"
            >
              <Search size={18} />
            </button>
            
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <Link
              href="/favourites"
              className="neo-border w-9 h-9 md:w-10 md:h-10 bg-[var(--card)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-black transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {favCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center border border-[var(--border)] neo-shadow">
                  {favCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="neo-button flex items-center gap-2 py-2 px-4 md:px-5 text-[10px] md:text-xs h-9 md:h-10"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">BAG</span>
              {itemCount > 0 && <span className="bg-[var(--accent)] text-black px-1.5 py-0.5 text-[9px] font-black ml-1 border border-black">{itemCount}</span>}
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t-2 border-[var(--border)] p-4 bg-[var(--background)] overflow-hidden"
            >
              <SearchBar />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-xs bg-[var(--background)] border-r-[3px] border-[var(--border)] z-[101] flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b-2 border-[var(--border)]">
                <span className="text-xl font-black italic tracking-tighter">KINCLOTH</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 neo-border hover:bg-[var(--accent)] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-[var(--border)] border-dashed group"
                  >
                    <span className="text-2xl font-black uppercase tracking-tighter group-hover:bg-[var(--accent)] group-hover:text-black transition-colors px-1">{label}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t-2 border-[var(--border)] flex items-center justify-between bg-[var(--sidebar)]">
                <ThemeToggle />
                <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">© 2026 KINCLOTH</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
