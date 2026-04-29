'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/lib/types';
import { Heart, Share2, ShoppingBag, Zap, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useRecentViewed } from '@/lib/recent-viewed-context';
import { useFavourites } from '@/lib/favourites-context';
import { useHeartBurst } from './HeartAnimation';
import { useToast } from './ToastContainer';
import { getProducts } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ProductCardSkeleton } from './Skeleton';

// ─── Shared Product Card ────────────────────────────────────────────────────
export const ProductCard: React.FC<{
  product: Product;
  index: number;
  mobile?: boolean;
}> = ({ product, index, mobile = false }) => {
  const { addToCart, isLoading, setIsCartOpen } = useCart();
  const { trackProduct } = useRecentViewed();
  const { toggleFavourite, isFavourite } = useFavourites();
  const { burst } = useHeartBurst();
  const { addToast } = useToast();
  const isLiked = isFavourite(product.id);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    trackProduct(product);
  }, [product, trackProduct]);

  const handleAdd = async (e?: React.MouseEvent) => {
    if (isAdding || isLoading) return;
    if (e) burst(e.clientX, e.clientY);
    setIsAdding(true);
    await addToCart(product);
    setIsAdding(false);
    addToast(`${product.name.toUpperCase()} ADDED`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      className={`relative flex ${mobile ? 'flex-row' : 'flex-col'} bg-[var(--card)] neo-border neo-shadow-hover transition-all group overflow-hidden`}
    >
      {/* ── Media ── */}
      <div className={`relative flex-shrink-0 ${mobile ? 'w-32' : 'w-full'} aspect-[3/4] bg-zinc-100 overflow-hidden border-b-[3px] border-black`}>
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
            />
          ) : (
            <div className="w-full h-full bg-zinc-200" />
          )}
        </Link>

        {/* Badge */}
        <div className="absolute top-0 left-0 bg-[var(--btn-bg)] text-[var(--btn-text)] text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
          {product.brand || 'KINCLOTH'}
        </div>

        {/* Like */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isLiked) burst(e.clientX, e.clientY);
            toggleFavourite(product);
          }}
          className={`absolute top-2 right-2 w-9 h-9 neo-border flex items-center justify-center transition-colors ${
            isLiked ? 'bg-[#ffff00]' : 'bg-[var(--card)]'
          }`}
        >
          <Heart size={16} fill={isLiked ? 'black' : 'none'} />
        </button>
      </div>

      {/* ── Info ── */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex justify-between items-start gap-3">
          <Link href={`/products/${product.id}`} className="flex-1 hover:underline">
            <h3 className="text-sm font-bold leading-snug tracking-tight text-[var(--foreground)]">
              {product.name}
            </h3>
          </Link>
          <span className="text-sm font-black bg-[var(--accent)] text-black px-2 py-0.5 border-2 border-[var(--border)] flex-shrink-0">
            ${product.price.toFixed(0)}
          </span>
        </div>

        <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto flex gap-2">
          <button
            onClick={(e) => handleAdd(e)}
            disabled={isAdding || isLoading}
            className="flex-1 neo-button flex items-center justify-center gap-2 py-2 h-10 text-xs"
          >
            {isAdding ? <Loader2 className="animate-spin" size={14} /> : <ShoppingBag size={14} />}
            {isAdding ? 'Adding...' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Shared infinite-scroll loader hook ────────────────────────────────────
export function useInfiniteProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const didInitialFetch = useRef(false);

  useEffect(() => {
    if (initialProducts.length > 0 || didInitialFetch.current) return;
    didInitialFetch.current = true;
    setIsLoadingMore(true);
    getProducts(1, 10)
      .then(data => {
        if (data.length === 0) setHasMore(false);
        else { setProducts(data); setHasMore(data.length >= 10); }
      })
      .catch(console.error)
      .finally(() => setIsLoadingMore(false));
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const next = page + 1;
      const more = await getProducts(next, 10);
      if (more.length === 0) setHasMore(false);
      else { setProducts(prev => [...prev, ...more]); setPage(next); }
    } catch (e) { console.error(e); }
    finally { setIsLoadingMore(false); }
  }, [page, isLoadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return { products, isLoadingMore, hasMore, bottomRef };
}

// ─── Desktop Feed (2-col responsive grid) ──────────────────────────────────
export const DesktopFeed: React.FC<{
  products: Product[];
  isLoadingMore: boolean;
  hasMore: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}> = ({ products, isLoadingMore, hasMore, bottomRef }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-10 border-b-[3px] border-[var(--border)] pb-5">
        <h2 className="text-2xl font-black tracking-tight">New Drops</h2>
        <div className="flex items-center gap-2 bg-[var(--accent)] px-3 py-1.5 border-[3px] border-[var(--border)] neo-shadow">
          <Zap size={16} fill="black" />
          <span className="font-bold text-xs uppercase tracking-widest text-black">Live Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((p, i) => <ProductCard key={`${p.id}-${i}`} product={p} index={i} />)
        ) : (
          [1,2,3,4,5,6,7,8].map(n => <ProductCardSkeleton key={`initial-skeleton-${n}`} />)
        )}
        {isLoadingMore && [1,2,3,4].map(n => <ProductCardSkeleton key={`skeleton-${n}`} />)}
      </div>

      <div ref={bottomRef} className="h-24 flex items-center justify-center mt-12">
        {!hasMore && products.length > 0 && (
          <div className="neo-border px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
            All products loaded
          </div>
        )}
      </div>
    </div>
  );
};
