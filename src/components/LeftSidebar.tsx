'use client';

import React from 'react';
import { Filter, TrendingUp, Sliders, History } from 'lucide-react';
import { Product } from '@/lib/types';
import { useRecentViewed } from '@/lib/recent-viewed-context';

interface LeftSidebarProps {
  products: Product[];
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ products }) => {
  const { recentProducts } = useRecentViewed();
  const [activeCategory, setActiveCategory] = React.useState('All');

  // Derive dynamic categories
  const categories = React.useMemo(() => {
    return ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  }, [products]);

  // "AI" (Heuristic) Personalization for Top Picks
  const topPicks = React.useMemo(() => {
    if (recentProducts.length === 0) {
      return products.slice(0, 4);
    }

    const userCategories = new Set(recentProducts.map(p => p.category).filter(Boolean));
    const userKeywords = recentProducts.flatMap(p => p.name.toLowerCase().split(' ')).filter(k => k.length > 3);

    const scored = products
      .filter(p => !recentProducts.find(rp => rp.id === p.id))
      .map(p => {
        let score = 0;
        if (userCategories.has(p.category)) score += 10;
        
        const text = p.name.toLowerCase();
        userKeywords.forEach(k => {
          if (text.includes(k)) score += 2;
        });

        return { product: p, score };
      });

    const recommended = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(s => s.product);

    if (recommended.length < 4) {
      const remaining = products.filter(p => !recommended.find(rp => rp.id === p.id) && !recentProducts.find(rp => rp.id === p.id));
      return [...recommended, ...remaining.slice(0, 4 - recommended.length)];
    }

    return recommended;
  }, [products, recentProducts]);

  return (
    <aside className="flex flex-col gap-4 h-full">
      
      {/* Categories Widget */}
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-rose-400" />
          <span className="text-sm font-black uppercase tracking-wider text-foreground">Categories</span>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          {categories.map((cat) => (
            <button
              key={cat as string}
              onClick={() => setActiveCategory(cat as string)}
              className={`text-left text-[13px] px-3 py-2 rounded-xl font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                  : 'text-muted hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {cat as string}
            </button>
          ))}
        </div>
      </div>

      {/* Top Picks (Personalized) */}
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {recentProducts.length > 0 ? (
              <History size={16} className="text-emerald-400" />
            ) : (
              <TrendingUp size={16} className="text-rose-400" />
            )}
            <span className="text-sm font-black uppercase tracking-wider text-foreground">
              {recentProducts.length > 0 ? 'Picked for You' : 'Top Picks'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          {topPicks.map((item) => (
            <div key={item.id} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-muted/10 overflow-hidden flex-shrink-0 border border-border group-hover:scale-105 transition-transform">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted/20" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-foreground truncate group-hover:text-rose-500 transition-colors">
                  {item.name}
                </p>
                <p className="text-[11px] text-muted font-bold">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Widget */}
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sliders size={16} className="text-blue-400" />
          <span className="text-sm font-black uppercase tracking-wider text-foreground">Sort By</span>
        </div>
        <div className="flex flex-col gap-2">
          {['Newest', 'Price: Low-High', 'Price: High-Low', 'Most Popular'].map((sort) => (
            <button
              key={sort}
              className="text-left text-[12px] px-3 py-2 rounded-lg font-bold text-muted hover:bg-foreground/5 hover:text-foreground transition-all"
            >
              {sort}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
