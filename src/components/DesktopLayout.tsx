'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Video } from 'lucide-react';
import { HeroSlider } from './HeroSlider';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { MobileFeed } from './MobileFeed';
import { DesktopFeed, useInfiniteProducts } from './DesktopFeed';
import { CartDrawer } from './CartDrawer';
import { CheckoutSheet } from './CheckoutSheet';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { PersonalizedSection } from './PersonalizedSection';
import { Footer } from './Footer';
import { SearchProvider } from '@/lib/search-context';
import { useFavourites } from '@/lib/favourites-context';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/lib/types';
import { useState, useMemo } from 'react';
import { ShoppingBag } from 'lucide-react';

interface DesktopLayoutProps {
  initialProducts: Product[];
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ initialProducts }) => {
  const { isCartOpen, setIsCartOpen, itemCount } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { count: favCount } = useFavourites();
  const { products, isLoadingMore, hasMore, bottomRef } = useInfiniteProducts(initialProducts);
  return (
    <SearchProvider products={products}>
      <style>{`
        .sc-mobile-only  { display: block; }
        .sc-desktop-only { display: none; }

        @media (min-width: 900px) {
          .sc-mobile-only  { display: none !important; }
          .sc-desktop-only { display: flex !important; }
        }

        .sc-sidebar::-webkit-scrollbar { display: none; }
        .sc-sidebar { scrollbar-width: none; -ms-overflow-style: none; }

        .sc-main-col::-webkit-scrollbar { display: none; }
        .sc-main-col { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {/* ── MOBILE (< 900px): card-based scrollable feed ── */}
      <div className="sc-mobile-only" style={{ width: '100%', height: '100svh' }}>
        <MobileFeed 
          initialProducts={initialProducts} 
          onOpenCart={() => setIsCartOpen(true)}
        />
      </div>

      {/* ── DESKTOP (≥ 900px): 3-column layout ── */}
      <div
        className="sc-desktop-only"
        style={{
          flexDirection: 'column',
          width: '100%',
          height: '100svh',
          background: 'var(--background)',
          color: 'var(--foreground)',
          overflow: 'hidden',
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* Desktop Header */}
        <header style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--header-bg)',
          backdropFilter: 'blur(20px)',
          zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 900 }}>CA</span>
            </div>
            <span style={{ color: 'var(--foreground)', fontSize: 17, fontWeight: 900, letterSpacing: '-0.04em' }}>
              CHI<span style={{ color: 'var(--accent)' }}>ANGEL</span>
            </span>
          </div>

          <SearchBar />

          {/* Nav + Actions */}
          <nav style={{ display: 'flex', gap: 28 }}>
            {['Shop', 'New In', 'Trending', 'Wishlist', 'Sale'].map((item) => (
              item === 'Wishlist' ? (
                <Link key={item} href="/favourites" style={{
                  textDecoration: 'none',
                  color: 'var(--muted)', fontSize: 14, fontWeight: 600,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  {item}
                </Link>
              ) : item === 'Shop' ? (
                <Link key={item} href="/shop" style={{
                  textDecoration: 'none',
                  color: 'var(--muted)', fontSize: 14, fontWeight: 600,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  {item}
                </Link>
              ) : (
                <button key={item} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: 14, fontWeight: 600,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  {item}
                </button>
              )
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/reels" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 12,
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 800,
              boxShadow: '0 4px 12px rgba(244, 63, 94, 0.2)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Video size={16} fill="white" />
              Watch
            </Link>

            <ThemeToggle />

            {/* Favourites Link */}
            <Link href="/favourites" style={{
              position: 'relative', width: 40, height: 40, borderRadius: 12,
              background: 'var(--card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', color: 'var(--foreground)',
              transition: 'all 0.2s',
            }}>
              <Heart size={18} style={{ stroke: 'var(--foreground)' }} />
              {favCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  minWidth: 18, height: 18, borderRadius: 9,
                  background: '#ef4444', color: 'var(--accent-foreground)',
                  fontSize: 10, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', border: '2px solid var(--background)',
                }}>
                  {favCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                position: 'relative', width: 40, height: 40, borderRadius: 12,
                background: 'var(--foreground)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--background)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  minWidth: 18, height: 18, borderRadius: 9,
                  background: 'var(--accent)', color: '#fff',
                  fontSize: 10, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', border: '2px solid var(--background)',
                }}>
                  {itemCount}
                </span>
              )}
            </button>

            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>
              Sign In
            </button>
            <button style={{
              padding: '8px 18px', background: 'var(--foreground)', color: 'var(--background)',
              border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>
              Join Free
            </button>
          </div>
        </header>

        {/* 3-column grid */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '270px 1fr 270px',
          overflow: 'hidden',
          maxWidth: 1440,
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Left Sidebar */}
          <div className="sc-sidebar" style={{
            borderRight: '1px solid var(--border)',
            overflowY: 'auto',
            padding: 20,
            background: 'var(--sidebar)',
          }}>
            <LeftSidebar products={products} />
          </div>

          {/* Centre: Hero + Feed + Footer */}
          <div className="sc-main-col" style={{ overflowY: 'auto' }}>
            <div style={{ padding: '16px 16px 0' }}>
              <HeroSlider />
              <PersonalizedSection products={products} />
            </div>
            <DesktopFeed 
              products={products} 
              isLoadingMore={isLoadingMore} 
              hasMore={hasMore} 
              bottomRef={bottomRef} 
            />
            <Footer />
          </div>

          {/* Right Sidebar */}
          <div className="sc-sidebar" style={{
            borderLeft: '1px solid var(--border)',
            overflowY: 'auto',
            padding: 20,
            background: 'var(--sidebar)',
          }}>
            <RightSidebar onOpenCart={() => setIsCartOpen(true)} />
          </div>
        </div>
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
    </SearchProvider>
  );
};
