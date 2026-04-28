'use client';

import React, { useMemo } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Product } from '@/lib/types';
import { useRecentViewed } from '@/lib/recent-viewed-context';
import { useSearch } from '@/lib/search-context';
import { ProductCard } from './DesktopFeed';
import { motion } from 'framer-motion';

export function PersonalizedSection({ products }: { products: Product[] }) {
  const { recentProducts } = useRecentViewed();
  const { recentQueries } = useSearch();

  // "AI" Recommendation Engine
  const recommendedItems = useMemo(() => {
    if (products.length === 0) return [];

    // If no history, show trending/random picks
    if (recentProducts.length === 0 && recentQueries.length === 0) {
      return products.slice(4, 8); // Offset from main feed
    }

    // 1. Build User Profile
    const profileBrands = new Set(recentProducts.map(p => p.brand).filter(Boolean));
    const profileKeywords = [
      ...recentProducts.flatMap(p => p.name.toLowerCase().split(' ')),
      ...recentQueries.flatMap(q => q.toLowerCase().split(' '))
    ].filter(k => k.length > 3);

    // 2. Score Catalog
    const scored = products
      .filter(p => !recentProducts.find(rp => rp.id === p.id)) // Exclude viewed
      .map(p => {
        let score = 0;
        
        // Brand affinity
        if (profileBrands.has(p.brand)) score += 15;
        
        // Keyword matching
        const text = `${p.name} ${p.description}`.toLowerCase();
        profileKeywords.forEach(k => {
          if (text.includes(k)) score += 3;
        });

        // Decay slightly for very old products if we had timestamps
        return { product: p, score };
      });

    // 3. Rank and Fill
    const top = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(s => s.product);

    // Backfill if needed
    if (top.length < 4) {
      const remaining = products.filter(p => !top.find(tp => tp.id === p.id) && !recentProducts.find(rp => rp.id === p.id));
      return [...top, ...remaining.slice(0, 4 - top.length)];
    }

    return top;
  }, [products, recentProducts, recentQueries]);

  if (recommendedItems.length === 0) return null;

  const isActuallyPersonalized = recentProducts.length > 0 || recentQueries.length > 0;

  return (
    <div style={{ margin: '32px 0 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 16, 
            background: isActuallyPersonalized ? 'rgba(124,58,237,0.1)' : 'rgba(251,191,36,0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            {isActuallyPersonalized ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={22} className="text-rose-500" />
              </motion.div>
            ) : (
              <Zap size={22} className="text-amber-500 fill-amber-500/20" />
            )}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--foreground)', margin: 0, letterSpacing: '-0.02em' }}>
              {isActuallyPersonalized ? 'Tailored For You' : 'Trending Now'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0', fontWeight: 500 }}>
              {isActuallyPersonalized 
                ? 'Based on your browsing history and preferences' 
                : 'Discover our most popular picks this week'
              }
            </p>
          </div>
        </div>
        
        <div style={{ marginLeft: 'auto' }}>
           <button style={{ 
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, fontWeight: 900, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            Refresh <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {recommendedItems.map((product, i) => (
          <ProductCard key={`personalized-${product.id}`} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
