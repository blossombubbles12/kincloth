'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Zap } from 'lucide-react';
import { useFavourites } from '@/lib/favourites-context';
import { ProductCard } from './DesktopFeed';
import { MainLayout } from './MainLayout';

export function FavouritesPageView() {
  const { favourites, count } = useFavourites();

  return (
    <MainLayout>
      {/* ── Page Content ── */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-12 pb-8">
        <div className="flex items-center justify-between border-b-[3px] border-[var(--border)] pb-5">
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase">My Favourites</h1>
            <p className="text-sm font-bold text-[var(--muted)] mt-2 uppercase tracking-widest">
              {count > 0 ? `${count} saved item${count !== 1 ? 's' : ''}` : 'No saved items yet'}
            </p>
          </div>
          <div className="w-16 h-16 neo-border bg-[var(--accent)] flex items-center justify-center neo-shadow">
            <Heart size={28} fill="black" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 pb-20 flex-1">
        {favourites.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center border-[3px] border-[var(--border)] bg-[var(--card)] neo-shadow flex flex-col items-center">
            <Heart size={64} className="mb-6 text-[var(--muted)]" />
            <h2 className="text-2xl font-black tracking-tight uppercase mb-3">
              Nothing saved yet
            </h2>
            <p className="text-sm font-bold text-[var(--muted)] max-w-sm mb-8 uppercase tracking-widest leading-relaxed">
              Tap the heart icon on any product to save it here for later. Your wishlist persists across visits.
            </p>
            <Link href="/shop" className="neo-button flex items-center gap-2">
              <Zap size={16} /> BROWSE PRODUCTS
            </Link>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {favourites.map((product, i) => (
              <ProductCard
                key={`${product.id}-${i}`}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
