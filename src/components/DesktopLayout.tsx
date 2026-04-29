'use client';

import React from 'react';
import { HeroSlider } from './HeroSlider';
import { DesktopFeed, useInfiniteProducts } from './DesktopFeed';
import { PersonalizedSection } from './PersonalizedSection';
import { CategoryGrid } from './CategoryGrid';
import { AboutSnippet } from './AboutSnippet';
import { Product } from '@/lib/types';

interface DesktopLayoutProps {
  initialProducts: Product[];
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ initialProducts }) => {
  const { products, isLoadingMore, hasMore, bottomRef } = useInfiniteProducts(initialProducts);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="mb-12">
        <HeroSlider />
      </div>

      {/* Category Navigation Blocks */}
      <CategoryGrid />

      {/* AI Copilot / Tailored Chaos */}
      <PersonalizedSection products={initialProducts} />

      {/* About Teaser */}
      <AboutSnippet />

      {/* Product Feed */}
      <DesktopFeed
        products={products}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        bottomRef={bottomRef}
      />
    </div>
  );
};
