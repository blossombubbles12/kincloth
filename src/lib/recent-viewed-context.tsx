'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from './types';

interface RecentViewedContextType {
  recentProducts: Product[];
  trackProduct: (product: Product) => void;
}

const RecentViewedContext = createContext<RecentViewedContextType | undefined>(undefined);

export const RecentViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recent_viewed');
    if (saved) {
      try {
        setRecentProducts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load recent products', e);
      }
    }
  }, []);

  const trackProduct = useCallback((product: Product) => {
    setRecentProducts(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 5);
      // Only update local storage if it actually changed
      if (JSON.stringify(prev) !== JSON.stringify(updated)) {
        localStorage.setItem('recent_viewed', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, []);

  return (
    <RecentViewedContext.Provider value={{ recentProducts, trackProduct }}>
      {children}
    </RecentViewedContext.Provider>
  );
};

export const useRecentViewed = () => {
  const context = useContext(RecentViewedContext);
  if (!context) throw new Error('useRecentViewed must be used within a RecentViewedProvider');
  return context;
};
