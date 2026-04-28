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

// ─── Shared Product Card (used by both Desktop & Mobile) ────────────────────
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
    addToast(`${product.name.toUpperCase()} ADDED TO BAG`, 'success');
    setTimeout(() => setIsCartOpen(true), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: mobile ? 16 : 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: mobile ? 'row' : 'column',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* ── Media ── */}
      <div style={{
        position: 'relative',
        flexShrink: 0,
        width: mobile ? 120 : '100%',
        aspectRatio: mobile ? '3/4' : '4/5',
        background: 'var(--card)',
        overflow: 'hidden',
      }}>
        <Link href={`/products/${product.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          {product.video_url ? (
            <video
              src={product.video_url}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              muted loop playsInline autoPlay
            />
          ) : product.thumbnail_url ? (
            <img
              src={product.thumbnail_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }} />
          )}
        </Link>

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Brand badge */}
        <div style={{
          position: 'absolute', top: 8, left: 8,
          background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
          color: '#fff', fontSize: mobile ? 8 : 10, fontWeight: 900,
          padding: mobile ? '2px 7px' : '4px 10px', borderRadius: 6,
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          {product.brand || 'BRAND'}
        </div>

        {/* Like */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isLiked) {
              burst(e.clientX, e.clientY);
              addToast('Added to Wishlist!', 'success');
            } else {
              addToast('Removed from Wishlist', 'info');
            }
            toggleFavourite(product);
          }}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: mobile ? 28 : 34, height: mobile ? 28 : 34,
            borderRadius: '50%',
            background: 'var(--header-bg)', backdropFilter: 'blur(6px)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <Heart
            size={mobile ? 12 : 15}
            style={{ fill: isLiked ? '#ef4444' : 'none', stroke: isLiked ? '#ef4444' : 'var(--foreground)' }}
          />
        </button>
      </div>

      {/* ── Info ── */}
      <div style={{
        padding: mobile ? '14px 16px' : '16px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: mobile ? 8 : 12,
        flex: 1,
        justifyContent: 'space-between',
      }}>
        <Link href={`/products/${product.id}`} className="block group/text">
          <h3 style={{
            color: 'var(--foreground)', fontWeight: 800,
            fontSize: mobile ? 14 : 15,
            marginBottom: 4, lineHeight: 1.3,
          }} className="group-hover/text:text-rose-500 transition-colors">
            {product.name}
          </h3>
          <p style={{
            color: 'var(--muted)', fontSize: mobile ? 11 : 12, lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: mobile ? 2 : 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.description}
          </p>
        </Link>

        {/* Price + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ color: 'var(--foreground)', fontWeight: 900, fontSize: mobile ? 16 : 18 }}>
            ${product.price.toFixed(2)}
          </span>

          <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: mobile ? 'flex-end' : 'initial' }}>
            {mobile && (
              <motion.button
                whileTap={{ scale: 0.8, rotate: isLiked ? -15 : 15 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isLiked) burst(e.clientX, e.clientY);
                  toggleFavourite(product);
                  addToast(isLiked ? 'Removed from Wishlist' : 'Added to Wishlist!', isLiked ? 'info' : 'success');
                }}
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: isLiked ? 'rgba(244,63,94,0.1)' : 'var(--card)',
                  border: `1px solid ${isLiked ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Heart
                  size={16}
                  style={{ fill: isLiked ? 'var(--accent)' : 'none', stroke: isLiked ? 'var(--accent)' : 'var(--foreground)' }}
                />
              </motion.button>
            )}
            {!mobile && (
              <button style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--border)',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <Share2 size={14} style={{ stroke: 'var(--muted)' }} />
              </button>
            )}

            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAdd(e);
              }}
              disabled={isAdding || isLoading}
              style={{
                height: mobile ? 34 : 36,
                padding: `0 ${mobile ? 12 : 16}px`,
                borderRadius: 10,
                background: isAdding ? '#22c55e' : 'var(--foreground)',
                color: isAdding ? '#fff' : 'var(--background)',
                border: 'none', fontWeight: 800,
                fontSize: mobile ? 12 : 13,
                display: 'flex', alignItems: 'center', gap: 5,
                cursor: 'pointer', transition: 'all 0.2s',
                opacity: (isAdding || isLoading) ? 0.7 : 1,
                whiteSpace: 'nowrap',
                flex: mobile ? 1 : 'none',
                maxWidth: mobile ? 100 : 'none',
                justifyContent: 'center',
              }}
            >
              <AnimatePresence mode="wait">
                {isAdding ? (
                  <motion.span key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{
                      width: 12, height: 12, border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff', borderRadius: '50%', animation: 'sc-spin 0.7s linear infinite'
                    }} />
                    {mobile ? '' : 'Adding'}
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <ShoppingBag size={12} />
                    {mobile ? 'Add' : 'Add to Bag'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
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

  // If we got no SSR products, fetch page 1 immediately on mount
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
interface DesktopFeedProps {
  products: Product[];
  isLoadingMore: boolean;
  hasMore: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export const DesktopFeed: React.FC<DesktopFeedProps> = ({ 
  products, 
  isLoadingMore, 
  hasMore, 
  bottomRef 
}) => {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: 'var(--foreground)', fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em', margin: 0 }}>For You</h2>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2, marginBottom: 0 }}>{products.length} products</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={14} style={{ fill: '#fbbf24', stroke: '#fbbf24' }} />
          <span style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700 }}>Live Feed</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {products.length > 0 ? (
          products.map((p, i) => <ProductCard key={`${p.id}-${i}`} product={p} index={i} />)
        ) : (
          [1,2,3,4,5,6,7,8].map(n => <ProductCardSkeleton key={`initial-skeleton-${n}`} />)
        )}
        {isLoadingMore && [1,2,3,4].map(n => <ProductCardSkeleton key={`skeleton-${n}`} />)}
      </div>

      <div ref={bottomRef} style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
        {!hasMore && products.length > 0 && <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, margin: 0 }}>All products loaded</p>}
      </div>

      <style>{`@keyframes sc-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </div>
  );
};
