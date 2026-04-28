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

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode; products: Product[] }> = ({ children, products }) => {
  const [query, setQuery] = useState('');
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) setRecentQueries(JSON.parse(saved));
  }, []);

  const trackSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentQueries(prev => {
      const filtered = prev.filter(item => item !== q);
      const updated = [q, ...filtered].slice(0, 5);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
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

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within a SearchProvider');
  return context;
};
