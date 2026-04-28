'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { CartDrawer } from './CartDrawer';
import { CheckoutSheet } from './CheckoutSheet';
import { getProducts } from '@/app/actions';

interface FeedProps {
  initialProducts: Product[];
}

export const Feed: React.FC<FeedProps> = ({ initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length >= 10);
  const [page, setPage] = useState(1);
  const { itemCount } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newProducts = await getProducts(nextPage, 10);
      
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, isLoadingMore, hasMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollY = container.scrollTop;
      const height = container.clientHeight;
      const index = Math.round(scrollY / height);
      
      if (index !== activeIndex) {
        setActiveIndex(index);
      }

      // Load more when reaching the second to last item
      if (index >= products.length - 2 && !isLoadingMore && hasMore) {
        loadMoreProducts();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeIndex, products.length, isLoadingMore, hasMore, loadMoreProducts]);

  return (
    <main className="relative w-full h-[100svh] overflow-hidden bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30 pointer-events-none">
        <h1 className="text-xl font-black text-white tracking-tighter pointer-events-auto">
          SCROLL<span className="text-zinc-500">COMMERCE</span>
        </h1>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          className="relative p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pointer-events-auto transition-colors hover:bg-white/20"
        >
          <ShoppingBag size={24} className="text-white" />
          <AnimatePresence mode="wait">
            {itemCount > 0 && (
              <motion.span 
                key={itemCount}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-tr from-red-500 to-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)] border border-white/20"
              >
                {itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </header>

      {/* Feed Container */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
      >
        {products.map((product, index) => (
          <ProductCard 
            key={`${product.id}-${index}`} 
            product={product} 
            isActive={index === activeIndex} 
          />
        ))}
        
        {/* Loading Indicator */}
        {isLoadingMore && (
          <div className="w-full h-[100svh] snap-start flex items-center justify-center bg-black">
            <Loader2 className="w-10 h-10 text-white animate-spin opacity-50" />
          </div>
        )}
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutSheet 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
};
