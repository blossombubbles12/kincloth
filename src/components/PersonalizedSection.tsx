'use client';

import React, { useMemo } from 'react';
import { Sparkles, RefreshCcw, Cpu } from 'lucide-react';
import { Product } from '@/lib/types';
import { useRecentViewed } from '@/lib/recent-viewed-context';
import { useSearch } from '@/lib/search-context';
import { ProductCard } from './DesktopFeed';
import { motion } from 'framer-motion';

export function PersonalizedSection({ products }: { products: Product[] }) {
  const { recentProducts } = useRecentViewed();
  const { recentQueries } = useSearch();

  const recommendedItems = useMemo(() => {
    if (products.length === 0) return [];
    if (recentProducts.length === 0 && recentQueries.length === 0) {
      // Default: mix of items if no data yet
      return products.slice(0, 4);
    }

    const profileBrands = new Set(recentProducts.map(p => p.brand).filter(Boolean));
    const profileKeywords = [
      ...recentProducts.flatMap(p => p.name.toLowerCase().split(' ')),
      ...recentQueries.flatMap(q => q.toLowerCase().split(' '))
    ].filter(k => k.length > 3);

    const scored = products
      .filter(p => !recentProducts.find(rp => rp.id === p.id))
      .map(p => {
        let score = 0;
        if (profileBrands.has(p.brand)) score += 15;
        const text = `${p.name} ${p.description}`.toLowerCase();
        profileKeywords.forEach(k => {
          if (text.includes(k)) score += 3;
        });
        return { product: p, score };
      });

    const top = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(s => s.product);

    if (top.length < 4) {
      const remaining = products.filter(p => !top.find(tp => tp.id === p.id) && !recentProducts.find(rp => rp.id === p.id));
      return [...top, ...remaining.slice(0, 4 - top.length)];
    }

    return top;
  }, [products, recentProducts, recentQueries]);

  if (recommendedItems.length === 0) return null;

  const isActuallyPersonalized = recentProducts.length > 0 || recentQueries.length > 0;

  return (
    <div className="my-16 border-[3px] border-[var(--border)] bg-black text-white p-8 md:p-12 relative overflow-hidden group neo-shadow">
      {/* Background AI grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      {/* Accent block */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffff00] translate-x-16 -translate-y-16 rotate-45 group-hover:rotate-90 transition-transform duration-700" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 border-[3px] border-white bg-black flex items-center justify-center">
              {isActuallyPersonalized ? (
                <Cpu size={28} className="text-[#ffff00]" />
              ) : (
                <Sparkles size={28} className="text-[#ffff00]" />
              )}
            </div>
            <div>
              <p className="text-[#ffff00] font-black text-[10px] uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#ffff00] animate-pulse" /> 
                System Active
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none uppercase">
                {isActuallyPersonalized ? 'Tailored Chaos' : 'The Algorithm'}
              </h2>
              <p className="font-bold text-xs uppercase tracking-widest opacity-60 mt-2">
                {isActuallyPersonalized 
                  ? 'Real-time recommendations mapped to your session' 
                  : 'Curated cultural movers'
                }
              </p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#ffff00] transition-colors">
            <RefreshCcw size={14} /> Refresh Feed
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedItems.map((product, i) => (
            <motion.div
              key={`personalized-${product.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-black border-[3px] border-white text-white group/card relative overflow-hidden"
            >
              {/* Force the product card to have a dark theme specifically for this section */}
              <div className="dark">
                <ProductCard product={product} index={i} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
