'use client';

import React from 'react';
import { MainLayout } from './MainLayout';
import { DesktopLayout } from './DesktopLayout';
import { MobileFeed } from './MobileFeed';

/**
 * HomeView: root homepage shell.
 * Wrapped in a single MainLayout — header, footer, cart drawer all live there.
 */
export function HomeView() {
  return (
    <MainLayout>
      {/* ── MOBILE (< 1024px) ── */}
      <div className="sc-mobile-only">
        <MobileFeed initialProducts={[]} onOpenCart={() => {}} />
      </div>

      {/* ── DESKTOP (≥ 1024px) ── */}
      <div className="sc-desktop-only">
        <DesktopLayout initialProducts={[]} />
      </div>
    </MainLayout>
  );
}
