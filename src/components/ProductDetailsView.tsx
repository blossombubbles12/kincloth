'use client';

import React, { useState } from 'react';
import {
  ShoppingBag, Heart, ShieldCheck, Truck, RefreshCcw,
  Star, ChevronRight, Share2, ArrowLeft, Minus, Plus,
  Check, Zap
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './DesktopFeed';
import { ProductCardSkeleton } from './Skeleton';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { SearchProvider } from '@/lib/search-context';
import { CartDrawer } from './CartDrawer';
import { CheckoutSheet } from './CheckoutSheet';
import { ProductJsonLd } from './JsonLd';
import { useToast } from './ToastContainer';
import { useHeartBurst } from './HeartAnimation';
import { useFavourites } from '@/lib/favourites-context';
import { Footer } from './Footer';
import { MobileView } from './MobileView';
import Link from 'next/link';

// ─── Static review data ─────────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Alex M.', rating: 5, date: '3 days ago', body: 'Absolutely premium quality. The packaging was immaculate and delivery was lightning fast.' },
  { name: 'Jordan K.', rating: 5, date: '1 week ago', body: 'Exceeded my expectations. Fits perfectly and the material feels incredibly durable.' },
  { name: 'Sam P.', rating: 4, date: '2 weeks ago', body: 'Great product overall. Minor sizing tip: go half a size up for the most comfortable fit.' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { label: 'Midnight Black', hex: '#000000' },
  { label: 'Arctic White', hex: '#f4f4f5' },
  { label: 'Violet Storm', hex: '#7c3aed' },
];

interface Props {
  product: Product & { images?: string[]; variants?: any[] };
  allProducts: Product[];
}

// ─── Inner view (needs useCart, so must be client) ──────────────────────────
function PDPInner({ product, allProducts }: Props) {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { addToCart, isLoading, isCartOpen, setIsCartOpen } = useCart();
  const { addToast } = useToast();
  const { toggleFavourite, isFavourite } = useFavourites();
  const { burst } = useHeartBurst();
  const isLiked = isFavourite(product.id);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isCheckoutOpenLocal, setIsCheckoutOpenLocal] = useState(false);

  const galleryImages = [
    product.thumbnail_url,
    ...(product.images || []),
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
  ].filter(Boolean).slice(0, 4) as string[];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return;
    
    // Find matching variant
    const variant = product.variants?.find(v => {
      const hasSize = v.options?.some((opt: any) => opt.value === selectedSize);
      const hasColor = v.options?.some((opt: any) => opt.value === selectedColor.label);
      return hasSize && hasColor;
    }) || product.variants?.[0];

    setIsAdding(true);
    await addToCart(product, variant?.id);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsCartOpen(true);
    }, 1500);
    addToast(`${product.name.toUpperCase()} ADDED TO BAG`, 'success');
  };

  const avgRating = 4.9;
  const discountedPrice = (product.price * 1.4).toFixed(2);

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
        <MobileView showBack onOpenCart={() => setIsCartOpen(true)}>
          <div style={{ padding: '0 0 40px' }}>
            <div style={{ position: 'relative', aspectRatio: '4/5', background: 'var(--card)' }}>
              <img src={activeImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <button
                  onClick={() => toggleFavourite(product)}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'var(--header-bg)', backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Heart size={18} style={{ fill: isLiked ? '#ef4444' : 'none', stroke: isLiked ? '#ef4444' : 'var(--foreground)' }} />
                </button>
              </div>
            </div>

            <div style={{ padding: '24px 20px' }}>
              <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 900 }}>{product.brand}</span>
              <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{product.name}</h1>
              {/* Variations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: 'var(--foreground)', display: 'block', marginBottom: 12 }}>
                    Color: <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{selectedColor.label}</span>
                  </span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {COLORS.map(color => (
                      <motion.button
                        key={color.hex}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: color.hex,
                          border: selectedColor.hex === color.hex ? '3px solid var(--accent)' : '2px solid var(--border)',
                          padding: 0, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', color: 'var(--foreground)', display: 'block', marginBottom: 12 }}>Size</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {SIZES.map(size => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          width: 48, height: 48, borderRadius: 12,
                          background: selectedSize === size ? 'var(--foreground)' : 'var(--card)',
                          color: selectedSize === size ? 'var(--background)' : 'var(--foreground)',
                          border: `1px solid ${selectedSize === size ? 'var(--foreground)' : 'var(--border)'}`,
                          fontWeight: 800, fontSize: 13, cursor: 'pointer'
                        }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => {
                    burst(e.clientX, e.clientY);
                    handleAddToCart();
                  }}
                  disabled={isLoading || isAdding || isAdded}
                  style={{
                    flex: 1, padding: '16px', borderRadius: 16,
                    background: isAdded ? '#22c55e' : 'var(--foreground)',
                    color: isAdded ? '#fff' : 'var(--background)', fontWeight: 900, border: 'none',
                    fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    transition: 'all 0.2s',
                    boxShadow: isAdded ? '0 8px 24px rgba(34,197,94,0.3)' : '0 8px 24px rgba(0,0,0,0.1)',
                    cursor: (isLoading || isAdding || isAdded) ? 'not-allowed' : 'pointer',
                    opacity: isAdding ? 0.7 : 1
                  }}
                >
                  {isAdded ? <Check size={20} /> : <ShoppingBag size={20} />}
                  {isAdding ? 'Adding...' : isAdded ? 'Added to Bag' : 'Add to Bag'}
                </motion.button>

                <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                if (!isLiked) burst(e.clientX, e.clientY);
                toggleFavourite(product);
                addToast(isLiked ? 'Removed from Wishlist' : 'Added to Wishlist!', isLiked ? 'info' : 'success');
              }}
              style={{
                width: 56, height: 56, borderRadius: 18,
                background: isLiked ? 'rgba(244,63,94,0.1)' : 'var(--card)',
                border: `1px solid ${isLiked ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Heart size={22} style={{ fill: isLiked ? 'var(--accent)' : 'none', stroke: isLiked ? 'var(--accent)' : 'var(--foreground)' }} />
            </motion.button>
              </div>

              <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
                {product.description}
              </div>
            </div>
          </div>
        </MobileView>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="sc-desktop-only">
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 32px', borderBottom: '1px solid var(--border)',
          background: 'var(--header-bg)', backdropFilter: 'blur(20px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              color: 'var(--muted)', fontSize: 13, fontWeight: 700,
              textDecoration: 'none', padding: '8px 12px',
              borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)',
            }}>
              <ArrowLeft size={16} /> Back to Store
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #f43f5e, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>CA</span>
              </div>
              <span style={{ color: 'var(--foreground)', fontSize: 16, fontWeight: 900, letterSpacing: '-0.04em' }}>CHI<span style={{ color: 'var(--accent)' }}>ANGEL</span></span>
            </div>
          </div>
          <div style={{ flex: 1, maxWidth: 400, margin: '0 32px' }}><SearchBar /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            <button onClick={() => setIsCartOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: 'var(--foreground)', color: 'var(--background)', border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
              <ShoppingBag size={16} /> View Bag
            </button>
          </div>
        </header>

        <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
            <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
            <ChevronRight size={12} />
            <Link href="/shop" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 600 }}>Shop</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>{product.name}</span>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          {/* Left: Gallery */}
          <div>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ aspectRatio: '4/5', borderRadius: 24, overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--border)', position: 'relative', marginBottom: 16 }}
            >
              <img src={activeImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleFavourite(product)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--header-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Heart size={18} style={{ fill: isLiked ? '#ef4444' : 'none', stroke: isLiked ? '#ef4444' : 'var(--foreground)' }} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--header-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Share2 size={18} style={{ stroke: 'var(--foreground)' }} />
                </motion.button>
              </div>
            </motion.div>
            <div style={{ display: 'flex', gap: 12 }}>
              {galleryImages.map((img, i) => (
                <motion.button key={i} whileHover={{ scale: 1.05 }} onClick={() => setActiveImage(img)} style={{ width: 80, height: 80, borderRadius: 14, overflow: 'hidden', border: `2px solid ${activeImage === img ? 'var(--accent)' : 'var(--border)'}`, opacity: activeImage === img ? 1 : 0.6, cursor: 'pointer', background: 'var(--card)' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Info Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fbbf2415', padding: '4px 12px', borderRadius: 20, border: '1px solid #fbbf2430' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={13} style={{ fill: '#fbbf24', stroke: 'none' }} />)}
                <span style={{ fontSize: 12, fontWeight: 900, color: '#fbbf24' }}>4.9</span>
              </div>
              <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>{product.brand || 'CHIANGEL'}</span>
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, margin: 0 }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 32, fontWeight: 900 }}>${product.price.toFixed(2)}</span>
                <span style={{ fontSize: 18, color: 'var(--muted)', textDecoration: 'line-through' }}>${discountedPrice}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#22c55e15', padding: '4px 10px', borderRadius: 8, border: '1px solid #22c55e30' }}>
                <Zap size={12} style={{ fill: '#22c55e', stroke: 'none' }} />
                <span style={{ fontSize: 11, fontWeight: 900, color: '#22c55e' }}>YOU SAVE ${(parseFloat(discountedPrice) - product.price).toFixed(2)}</span>
              </div>
            </div>

            {/* Variations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', color: 'var(--foreground)', display: 'block', marginBottom: 16 }}>
                  Select Color: <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{selectedColor.label}</span>
                </span>
                <div style={{ display: 'flex', gap: 12 }}>
                  {COLORS.map(color => (
                    <motion.button
                      key={color.hex}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: color.hex,
                        border: selectedColor.hex === color.hex ? '4px solid var(--accent)' : '2px solid var(--border)',
                        padding: 0, cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: selectedColor.hex === color.hex ? '0 0 0 2px var(--background), 0 0 0 4px var(--accent)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', color: 'var(--foreground)', display: 'block', marginBottom: 16 }}>Select Size</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  {SIZES.map(size => (
                    <motion.button
                      key={size}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: 60, height: 60, borderRadius: 16,
                        background: selectedSize === size ? 'var(--foreground)' : 'var(--card)',
                        color: selectedSize === size ? 'var(--background)' : 'var(--foreground)',
                        border: `2px solid ${selectedSize === size ? 'var(--foreground)' : 'var(--border)'}`,
                        fontWeight: 900, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '8px 16px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}><Minus size={18} /></button>
                <span style={{ fontSize: 16, fontWeight: 800, minWidth: 20, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}><Plus size={18} /></button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  burst(e.clientX, e.clientY);
                  handleAddToCart();
                }}
                disabled={isLoading || isAdded}
                style={{ flex: 1, height: 56, borderRadius: 16, background: isAdded ? '#22c55e' : 'var(--foreground)', color: isAdded ? '#fff' : 'var(--background)', fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: isAdded ? '0 8px 24px rgba(34,197,94,0.3)' : '0 8px 32px rgba(0,0,0,0.1)' }}>
                {isAdded ? <Check size={20} /> : <ShoppingBag size={20} />}
                {isAdded ? 'Added to Bag' : 'Add to Bag'}
              </motion.button>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', margin: 0 }}>{product.description}</p>
          </div>
        </div>
      </div>

      {/* ── SHARED CONTENT (Reviews & Footer) ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 60 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32 }}>Customer Reviews</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {REVIEWS.map((review, i) => (
              <div key={i} style={{ padding: 24, borderRadius: 20, background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                  {Array.from({ length: review.rating }).map((_, s) => <Star key={s} size={14} style={{ fill: '#fbbf24', stroke: 'none' }} />)}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>"{review.body}"</p>
                <p style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>{review.name}</p>
              </div>
            ))}
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <div style={{ marginTop: 80 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32 }}>YOU MIGHT ALSO LIKE</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
              {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} mobile={true} />)}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 80 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 32 }}>YOU MIGHT ALSO LIKE</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20 }}>
              {[1,2,3,4].map(n => <ProductCardSkeleton key={`rel-skeleton-${n}`} mobile />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpenLocal(true); }} />
      <CheckoutSheet isOpen={isCheckoutOpenLocal} onClose={() => setIsCheckoutOpenLocal(false)} />
    </div>
  );
}

// ─── Exported wrapper that provides Search context ───────────────────────────
export function ProductDetailsView({ product, allProducts }: Props) {
  return (
    <SearchProvider products={allProducts}>
      <PDPInner product={product} allProducts={allProducts} />
    </SearchProvider>
  );
}
