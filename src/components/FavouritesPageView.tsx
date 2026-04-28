'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { useFavourites } from '@/lib/favourites-context';
import { useCart } from '@/lib/cart-context';
import { ThemeToggle } from './ThemeToggle';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { CheckoutSheet } from './CheckoutSheet';
import { MobileView } from './MobileView';
import { ProductCard } from './DesktopFeed';

export function FavouritesPageView() {
  const { favourites, toggleFavourite, count } = useFavourites();
  const { addToCart, isLoading } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddToCart = async (product: any) => {
    setAddingId(product.id);
    await addToCart(product);
    setAddingId(null);
  };

  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ minHeight: '100%', background: 'var(--background)', color: 'var(--foreground)' }}>
      <style>{`
        .sc-mobile-only  { display: block; }
        .sc-desktop-only { display: none; }
        @media (min-width: 1024px) {
          .sc-mobile-only  { display: none !important; }
          .sc-desktop-only { display: block !important; }
        }
      `}</style>

      {/* ── MOBILE VIEW ── */}
      <div className="sc-mobile-only">
        <MobileView title="Wishlist" onOpenCart={() => setIsCartOpen(true)}>
          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {favourites.length === 0 ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <Heart size={48} style={{ margin: '0 auto 20px', color: 'var(--border)' }} />
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>Nothing saved yet</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>Explore the store to add items to your wishlist.</p>
                <Link href="/shop" style={{ marginTop: 24, display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: '#fff', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>Go Shopping</Link>
              </div>
            ) : (
              favourites.map((product, i) => (
                <ProductCard
                  key={`${product.id}-${i}`}
                  product={product}
                  index={i}
                  mobile={true}
                />
              ))
            )}
          </div>
          <Footer />
        </MobileView>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="sc-desktop-only">
        {/* ── Header ── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--header-bg)',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: 'var(--muted)', fontSize: 13, fontWeight: 700,
              textDecoration: 'none', padding: '8px 12px',
              borderRadius: 10, border: '1px solid var(--border)',
              background: 'var(--card)',
            }}>
              <ArrowLeft size={16} /> Back to Store
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>CA</span>
              </div>
              <span style={{ color: 'var(--foreground)', fontSize: 15, fontWeight: 900, letterSpacing: '-0.04em' }}>
                CHI<span style={{ color: 'var(--accent)' }}>ANGEL</span>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 12,
                background: 'var(--foreground)', color: 'var(--background)',
                border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer',
              }}
            >
              <ShoppingBag size={16} /> View Bag
            </button>
          </div>
        </header>

        {/* ── Page Title ── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 32px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={24} style={{ fill: 'var(--accent)', stroke: 'none' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', margin: 0, color: 'var(--foreground)' }}>
                My Favourites
              </h1>
              <p style={{ fontSize: 14, color: 'var(--muted)', margin: '4px 0 0' }}>
                {count > 0 ? `${count} saved item${count !== 1 ? 's' : ''}` : 'No saved items yet'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 80px' }}>
          {favourites.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '100px 0', textAlign: 'center',
              }}
            >
              <div style={{
                width: 120, height: 120, borderRadius: 32,
                background: 'var(--card)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
              }}>
                <Heart size={52} style={{ color: 'var(--border)' }} />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--foreground)', letterSpacing: '-0.03em', margin: '0 0 12px' }}>
                Nothing saved yet
              </h2>
              <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 380, lineHeight: 1.6, margin: '0 0 36px' }}>
                Tap the heart icon on any product to save it here for later. Your wishlist persists across visits.
              </p>
              <Link href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 16,
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                color: '#fff', fontWeight: 800, fontSize: 15,
                textDecoration: 'none', boxShadow: '0 8px 32px rgba(244, 63, 94, 0.2)',
              }}>
                <Sparkles size={18} /> Browse Products
              </Link>
            </motion.div>
          ) : (
            /* Grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 24,
            }}>
              <AnimatePresence>
                {favourites.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: 'var(--card)', border: '1px solid var(--border)',
                      borderRadius: 20, overflow: 'hidden',
                      display: 'flex', flexDirection: 'column',
                    }}
                  >
                    {/* Image */}
                    <Link href={`/products/${product.id}`} style={{ display: 'block', position: 'relative', aspectRatio: '1/1.1' }}>
                      <img
                        src={product.thumbnail_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 50%)',
                      }} />
                      {/* Remove from favourites */}
                      <button
                        onClick={(e) => { e.preventDefault(); toggleFavourite(product); }}
                        style={{
                          position: 'absolute', top: 12, right: 12,
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'rgba(244,63,94,0.9)', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', backdropFilter: 'blur(8px)',
                        }}
                        title="Remove from favourites"
                      >
                        <Trash2 size={15} style={{ color: '#fff' }} />
                      </button>
                    </Link>

                    {/* Info */}
                    <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                      <div style={{ flex: 1 }}>
                        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--foreground)', margin: '0 0 4px', lineHeight: 1.3 }}>
                            {product.name}
                          </h3>
                        </Link>
                        <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.5,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {product.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--foreground)' }}>
                          ${product.price.toFixed(2)}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          disabled={isLoading || addingId === product.id}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '8px 16px', borderRadius: 12,
                            background: addingId === product.id ? '#22c55e' : 'var(--foreground)',
                            color: 'var(--background)', border: 'none',
                            fontWeight: 800, fontSize: 12, cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          <ShoppingBag size={14} />
                          {addingId === product.id ? 'Added!' : 'Add to Bag'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        <Footer />
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      <CheckoutSheet isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
}
