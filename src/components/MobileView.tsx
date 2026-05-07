'use client';

import React from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

interface MobileViewProps {
  children: React.ReactNode;
  title?: string;
  hideTitleBar?: boolean;
  showBack?: boolean;
  onOpenCart: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({ children, title = 'Kincloth', hideTitleBar = false }) => {

  return (
    <div className="flex flex-col h-dvh bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden">

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

      <MobileNav />


    </div>
  );
};
