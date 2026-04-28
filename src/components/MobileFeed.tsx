'use client';

import React from 'react';
import { Loader2, Zap } from 'lucide-react';
import { HeroSlider } from './HeroSlider';
import { Footer } from './Footer';
import { ProductCard, useInfiniteProducts } from './DesktopFeed';
import { Product } from '@/lib/types';
import { MobileView } from './MobileView';
import { ProductCardSkeleton } from './Skeleton';

interface MobileFeedProps {
  initialProducts: Product[];
  onOpenCart: () => void;
}

export const MobileFeed: React.FC<MobileFeedProps> = ({ initialProducts, onOpenCart }) => {
  const { products, isLoadingMore, hasMore, bottomRef } = useInfiniteProducts(initialProducts);

  return (
    <MobileView onOpenCart={onOpenCart}>
      {/* Hero Slider */}
      <div style={{ padding: '16px 16px 0' }}>
        <HeroSlider />
      </div>

      {/* Section header */}
      <div style={{
        padding: '20px 16px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h2 style={{ color: 'var(--foreground)', fontWeight: 900, fontSize: 17, letterSpacing: '-0.03em', margin: 0 }}>
            For You
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2, marginBottom: 0 }}>
            {products.length} products
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Zap size={13} style={{ fill: '#fbbf24', stroke: '#fbbf24' }} />
          <span style={{ color: '#fbbf24', fontSize: 11, fontWeight: 700 }}>Live Feed</span>
        </div>
      </div>

      {/* Product list */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {products.length > 0 ? (
          products.map((product, i) => (
            <ProductCard
              key={`${product.id}-${i}`}
              product={product}
              index={i}
              mobile={true}
            />
          ))
        ) : (
          [1,2,3,4].map(n => <ProductCardSkeleton key={`initial-skeleton-${n}`} mobile />)
        )}
        {isLoadingMore && [1,2,3].map(n => <ProductCardSkeleton key={`skeleton-${n}`} mobile />)}
      </div>

      {/* Load more sentinel */}
      <div
        ref={bottomRef}
        style={{ height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}
      >
        {!hasMore && products.length > 0 && (
          <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, margin: 0 }}>
            You've seen everything ✨
          </p>
        )}
      </div>

      {/* Mobile Footer */}
      <div style={{ marginTop: 20 }}>
        <Footer />
      </div>

      <style>{`
        @keyframes sc-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </MobileView>
  );
};
