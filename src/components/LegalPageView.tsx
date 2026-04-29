'use client';

import React from 'react';
import { MainLayout } from './MainLayout';

interface LegalPageViewProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPageView({ title, lastUpdated, children }: LegalPageViewProps) {
  return (
    <MainLayout>
      <div className="flex flex-col w-full max-w-4xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-12 border-b-[3px] border-[var(--border)] pb-8">
          <h1 className="text-4xl lg:text-7xl font-black uppercase tracking-tight leading-none mb-4">
            {title}
          </h1>
          <div className="inline-block bg-[var(--accent)] text-black px-3 py-1 neo-border text-xs font-bold uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </div>
        </div>

        <div className="max-w-none [&>h2]:text-2xl [&>h2]:font-black [&>h2]:uppercase [&>h2]:tracking-widest [&>h2]:mt-12 [&>h2]:mb-4 [&>p]:font-medium [&>p]:leading-relaxed [&>p]:text-[var(--muted)] [&>p]:mb-8 [&>p>a]:text-[var(--foreground)] [&>p>a]:font-bold hover:[&>p>a]:bg-[var(--accent)] hover:[&>p>a]:text-black transition-colors">
          {children}
        </div>
      </div>
    </MainLayout>
  );
}
