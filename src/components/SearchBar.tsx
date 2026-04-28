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
    <div ref={containerRef} className="relative w-full max-w-md group">
      <div className={`relative flex items-center bg-zinc-100 dark:bg-zinc-900 border transition-all rounded-xl overflow-hidden ${isOpen ? 'border-rose-500 ring-2 ring-rose-500/10 shadow-lg' : 'border-zinc-200 dark:border-zinc-800'}`}>
        <Search className="ml-3 text-zinc-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products, brands..."
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500"
        />
        {query && (
          <button onClick={() => setQuery('')} className="mr-2 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full">
            <X size={14} className="text-zinc-400" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[100]"
          >
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                <p className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Suggestions</p>
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSearch(p.name)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                      {p.thumbnail_url && <img src={p.thumbnail_url} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-rose-500 transition-colors">{p.name}</p>
                      <p className="text-[11px] text-zinc-500">${p.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentQueries.length > 0 && (
              <div className="p-2">
                <p className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recent Searches</p>
                {recentQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSearch(q)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-left"
                  >
                    <Clock size={14} className="text-zinc-400" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{q}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Trending / No Results */}
            {suggestions.length === 0 && !query && (
              <div className="p-4 text-center">
                <TrendingUp size={24} className="mx-auto text-rose-500 mb-2 opacity-50" />
                <p className="text-sm text-zinc-500 font-medium">Try searching for "Nike" or "Premium"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
