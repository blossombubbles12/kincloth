'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from './types';

interface FavouritesContextType {
  favourites: Product[];
  toggleFavourite: (product: Product) => void;
  isFavourite: (id: string) => boolean;
  count: number;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favourites, setFavourites] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('favourites');
      if (saved) setFavourites(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleFavourite = useCallback((product: Product) => {
    setFavourites(prev => {
      const exists = prev.find(p => p.id === product.id);
      const updated = exists
        ? prev.filter(p => p.id !== product.id)
        : [product, ...prev];
      localStorage.setItem('favourites', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavourite = useCallback((id: string) => {
    return favourites.some(p => p.id === id);
  }, [favourites]);

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite, count: favourites.length }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
};
