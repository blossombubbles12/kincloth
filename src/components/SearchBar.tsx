'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useSearch } from '@/lib/search-context';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchBar() {
  const { query, setQuery, suggestions, recentQueries, trackSearch } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    trackSearch(q);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full group">
      <div className={`relative flex items-center bg-white neo-border transition-all ${isOpen ? 'neo-shadow bg-[#ffff00]' : ''}`}>
        <Search className="ml-4 text-black" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="SEARCH THE CHAOS..."
          className="w-full bg-transparent px-4 py-3 text-sm font-black outline-none text-black placeholder:text-black placeholder:opacity-30 uppercase tracking-widest"
        />
        {query && (
          <button onClick={() => setQuery('')} className="mr-4 p-1 hover:bg-black hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.1 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white neo-border neo-shadow overflow-hidden z-[100]"
          >
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="border-b-[4px] border-black">
                <p className="px-4 py-2 text-[10px] font-black text-black bg-[#f0f0f0] uppercase tracking-widest border-b-2 border-black">SUGGESTIONS</p>
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSearch(p.name)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#ffff00] border-b-2 border-black last:border-0 transition-colors text-left group"
                  >
                    <div className="w-12 h-12 neo-border bg-zinc-200 overflow-hidden flex-shrink-0 group-hover:rotate-2 transition-transform">
                      {p.thumbnail_url && <img src={p.thumbnail_url} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tighter">{p.name}</p>
                      <p className="text-xs font-medium text-[var(--muted)]">${p.price.toFixed(0)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentQueries.length > 0 && (
              <div className="bg-white">
                <p className="px-4 py-2 text-[10px] font-black text-black bg-[#f0f0f0] uppercase tracking-widest border-b-2 border-black">RECENTS</p>
                {recentQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSearch(q)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#ffff00] border-b-2 border-black last:border-0 text-left font-black text-xs uppercase"
                  >
                    <Clock size={14} />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Trending / No Results */}
            {suggestions.length === 0 && !query && (
              <div className="p-8 text-center bg-zinc-50">
                <TrendingUp size={32} className="mx-auto text-black mb-3 opacity-20" />
                <p className="text-xs font-medium uppercase tracking-widest opacity-40">Try searching for products or brands</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
