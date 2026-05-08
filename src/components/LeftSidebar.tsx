'use client';

import React from 'react';
import { Filter, TrendingUp, Sliders, History, Zap } from 'lucide-react';
import { Product } from '@/lib/types';
import { useRecentViewed } from '@/lib/recent-viewed-context';

interface LeftSidebarProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ products, selectedCategory, setSelectedCategory }) => {
  const { recentProducts } = useRecentViewed();

  const categories = ['All', 'Hoodies', 'Bottoms', 'T-Shirts', 'Accessories', 'Activewear', 'Plain Tees'];

  return (
    <div className="flex flex-col gap-10">
      {/* Categories Widget */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-black p-1">
            <Filter size={18} className="text-[#ffff00]" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest">Drops</h3>
        </div>

        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat as string}
              onClick={() => setSelectedCategory(cat as string)}
              className={`text-left text-sm font-black px-4 py-2 neo-border transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--accent)] text-black translate-x-2'
                  : 'bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-black hover:translate-x-1'
              }`}
            >
              {cat as string}
            </button>
          ))}
        </div>
      </section>

      {/* Recents / Recommendations */}
      <section className="neo-border bg-[var(--card)] p-6 neo-shadow text-[var(--foreground)]">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-[var(--border)] pb-2">
          <Zap size={18} className="fill-[var(--accent)] text-[var(--accent)]" />
          <h3 className="text-lg font-black tracking-tighter">VIBE CHECK</h3>
        </div>
        
        <div className="space-y-6">
          {products.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-center gap-4 group cursor-pointer border-b border-[var(--border)] opacity-80 hover:opacity-100 pb-4 last:border-0 last:pb-0">
              <div className="w-14 h-14 neo-border overflow-hidden flex-shrink-0 group-hover:rotate-3 transition-transform">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase leading-tight truncate group-hover:bg-[var(--accent)] group-hover:text-black px-1 w-fit">
                  {item.name}
                </p>
                <p className="text-sm font-bold">${item.price.toFixed(0)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experimental Widget */}
      <section className="bg-black text-white p-6 neo-shadow">
        <h4 className="font-black text-xs tracking-widest mb-4 opacity-50">FILTER BY VIBE</h4>
        <div className="flex flex-wrap gap-2">
          {['MINIMAL', 'CORE', 'EXPERIMENTAL', 'RAW', 'STREET'].map(vibe => (
            <button key={vibe} className="border border-white/30 px-2 py-1 text-[10px] font-black hover:bg-[#ffff00] hover:text-black transition-colors">
              #{vibe}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
