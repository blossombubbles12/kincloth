'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { HeroSlider } from './HeroSlider';
import { ProductCard, useInfiniteProducts } from './DesktopFeed';
import { Product } from '@/lib/types';
import { ProductCardSkeleton } from './Skeleton';
import { PersonalizedSection } from './PersonalizedSection';
import { CategoryGrid } from './CategoryGrid';
import { AboutSnippet } from './AboutSnippet';

interface MobileFeedProps {
  initialProducts: Product[];
  onOpenCart: () => void;
}

export const MobileFeed: React.FC<MobileFeedProps> = ({ initialProducts }) => {
  const { products, isLoadingMore, hasMore, bottomRef } = useInfiniteProducts([]);

  return (
    <div className="flex flex-col bg-[var(--background)]">
      {/* Hero */}
      <div className="p-4 pb-0">
        <HeroSlider />
      </div>

      <div className="px-4 pt-6">
        <CategoryGrid />
      </div>

      <div className="px-4">
        <PersonalizedSection products={initialProducts} />
      </div>

      <div className="px-4">
        <AboutSnippet />
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between px-4 pt-8 pb-4">
        <div>
          <h2 className="text-base font-bold tracking-tight">For You</h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">{products.length} products</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[var(--accent)] text-black px-2 py-1 neo-border">
          <Zap size={12} fill="black" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Product list */}
      <div className="px-4 grid grid-cols-2 gap-3 pb-4">
        {products.length > 0 ? (
          products.map((product, i) => (
            <ProductCard key={`${product.id}-${i}`} product={product} index={i} />
          ))
        ) : (
          [1, 2, 3, 4].map(n => <ProductCardSkeleton key={`initial-skeleton-${n}`} />)
        )}
        {isLoadingMore && [1, 2].map(n => <ProductCardSkeleton key={`skeleton-${n}`} />)}
      </div>

      {/* Sentinel */}
      <div ref={bottomRef} className="h-16 flex items-center justify-center">
        {!hasMore && products.length > 0 && (
          <p className="text-xs text-[var(--muted)] font-medium">All products loaded</p>
        )}
      </div>
    </div>
  );
};
