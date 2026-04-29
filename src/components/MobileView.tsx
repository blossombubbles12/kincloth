'use client';

import React from 'react';
import { Menu, Heart, LayoutGrid, Zap, Play } from 'lucide-react';
import { useFavourites } from '@/lib/favourites-context';
import Link from 'next/link';
import { Header } from './Header';

interface MobileViewProps {
  children: React.ReactNode;
  title?: string;
  hideTitleBar?: boolean;
  showBack?: boolean;
  onOpenCart: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({ children, title = 'Kincloth', hideTitleBar = false }) => {
  const { count: favCount } = useFavourites();

  return (
    <div className="flex flex-col h-[100svh] bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden">

      <Header />


      {/* Page title bar */}
      {!hideTitleBar && (
        <div className="flex-shrink-0 bg-[var(--btn-bg)] text-[var(--btn-text)] px-5 py-3 flex items-center justify-between border-b-[3px] border-[var(--border)]">
          <h1 className="text-sm font-bold uppercase tracking-widest">{title}</h1>
          <div className="w-6 h-0.5 bg-[var(--accent)]" />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[var(--background)]">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="flex-shrink-0 border-t-[3px] border-[var(--border)] bg-[var(--header-bg)] grid grid-cols-5 h-14">
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
            <span className="absolute top-2.5 right-4 bg-[var(--accent)] text-black text-[9px] font-black w-4 h-4 flex items-center justify-center border border-[var(--border)]">
              {favCount}
            </span>
          )}
        </Link>
        <button className="flex items-center justify-center hover:bg-[var(--accent)] hover:text-black transition-colors">
          <Menu size={20} />
        </button>
      </nav>


    </div>
  );
};
