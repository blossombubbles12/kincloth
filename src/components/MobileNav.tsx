'use client';

import React from 'react';
import { Menu, Heart, LayoutGrid, Zap, Play } from 'lucide-react';
import { useFavourites } from '@/lib/favourites-context';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

export function MobileNav() {
  const { count: favCount } = useFavourites();
  const { isMenuOpen, setIsMenuOpen } = useCart();

  return (
    <nav className="lg:hidden sticky bottom-0 z-50 flex-shrink-0 border-t-[3px] border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md grid grid-cols-5 h-16 pb-[env(safe-area-inset-bottom)]">
      <Link href="/" className="flex items-center justify-center border-r-[2px] border-[var(--border)] hover:bg-[var(--accent)] hover:text-black transition-colors">
        <LayoutGrid size={20} />
      </Link>
      <Link href="/shop" className="flex items-center justify-center border-r-[2px] border-[var(--border)] hover:bg-[var(--accent)] hover:text-black transition-colors">
        <Zap size={20} />
      </Link>
      <Link href="/reels" className="flex items-center justify-center border-r-[2px] border-[var(--border)] hover:bg-[var(--accent)] hover:text-black transition-colors">
        <Play size={20} />
      </Link>
      <Link href="/favourites" className="flex items-center justify-center border-r-[2px] border-[var(--border)] hover:bg-[var(--accent)] hover:text-black transition-colors relative">
        <Heart size={20} />
        {favCount > 0 && (
          <span className="absolute top-3 right-4 bg-[var(--accent)] text-black text-[9px] font-black w-4 h-4 flex items-center justify-center border border-[var(--border)]">
            {favCount}
          </span>
        )}
      </Link>
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center justify-center transition-colors ${isMenuOpen ? 'bg-[var(--accent)] text-black' : 'hover:bg-[var(--accent)] hover:text-black'}`}
      >
        <Menu size={20} />
      </button>
    </nav>
  );
}
