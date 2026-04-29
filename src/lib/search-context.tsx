'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from './types';

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  recentQueries: string[];
  trackSearch: (q: string) => void;
  suggestions: Product[];
}

// Safe no-op default — means SearchBar works even on pages without a provider
const defaultContext: SearchContextType = {
  query: '',
  setQuery: () => {},
  recentQueries: [],
  trackSearch: () => {},
  suggestions: [],
};

const SearchContext = createContext<SearchContextType>(defaultContext);

export const SearchProvider: React.FC<{ children: React.ReactNode; products: Product[] }> = ({
  children,
  products,
}) => {
  const [query, setQuery] = useState('');
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('recent_searches');
      if (saved) setRecentQueries(JSON.parse(saved));
    } catch {}
  }, []);

  const trackSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentQueries(prev => {
      const filtered = prev.filter(item => item !== q);
      const updated = [q, ...filtered].slice(0, 5);
      try { localStorage.setItem('recent_searches', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = products
        .filter(
          p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, products]);

  return (
    <SearchContext.Provider value={{ query, setQuery, recentQueries, trackSearch, suggestions }}>
      {children}
    </SearchContext.Provider>
  );
};

// Never throws — safe to call anywhere, even outside a provider
export const useSearch = () => useContext(SearchContext);
