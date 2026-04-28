'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Video, ArrowLeft, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useFavourites } from '@/lib/favourites-context';
import { ThemeToggle } from './ThemeToggle';

interface MobileViewProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  onOpenCart: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({ children, title, showBack = false, onOpenCart }) => {
  const { itemCount } = useCart();
  const { count: favCount } = useFavourites();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div style={{
      width: '100%',
      height: '100svh',
      background: 'var(--background)',
      color: 'var(--foreground)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* ── Mobile Menu Drawer ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'absolute', inset: 0, zIndex: 100,
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)'
              }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, width: '80%', maxWidth: 300,
                zIndex: 101, background: 'var(--background)', borderRight: '1px solid var(--border)',
                padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 32
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #f43f5e, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>CA</span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 900 }}>CHIANGEL</span>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Home', href: '/', icon: <Video size={20} /> },
                  { label: 'Shop All', href: '/shop', icon: <ShoppingBag size={20} /> },
                  { label: 'Wishlist', href: '/favourites', icon: <Heart size={20} /> },
                  { label: 'Reels', href: '/reels', icon: <Video size={20} /> },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px', borderRadius: 16, background: 'var(--card)',
                      border: '1px solid var(--border)', textDecoration: 'none',
                      color: 'var(--foreground)', fontWeight: 800, fontSize: 16
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Header ── */}
      <header style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--header-bg)',
        backdropFilter: 'blur(16px)',
        zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!showBack && (
            <button 
              onClick={() => setIsMenuOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer', padding: 4 }}
            >
              <Menu size={24} />
            </button>
          )}
          {showBack ? (
            <Link href="/" style={{ color: 'var(--foreground)', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={20} />
            </Link>
          ) : (
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>CA</span>
              </div>
              <span style={{ color: 'var(--foreground)', fontSize: 15, fontWeight: 900, letterSpacing: '-0.04em' }}>
                CHI<span style={{ color: 'var(--accent)' }}>ANGEL</span>
              </span>
            </Link>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/reels" style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.2)',
          }}>
            <Video size={18} fill="white" color="white" />
          </Link>
          <ThemeToggle />
          
          <Link href="/favourites" style={{
            position: 'relative', width: 40, height: 40, borderRadius: 12,
            background: 'var(--card)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none',
          }}>
            <Heart size={18} style={{ stroke: 'var(--foreground)' }} />
            {favCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                minWidth: 16, height: 16, borderRadius: 8,
                background: '#ef4444', color: '#fff',
                fontSize: 9, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px', border: '1.5px solid var(--background)',
              }}>
                {favCount}
              </span>
            )}
          </Link>

          <div style={{ position: 'relative' }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onOpenCart}
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'transparent',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ShoppingBag size={20} style={{ stroke: 'var(--foreground)' }} />
            </motion.button>
            <AnimatePresence mode="wait">
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{
                    position: 'absolute', top: -4, right: -4,
                    minWidth: 18, height: 18, borderRadius: 9,
                    background: 'linear-gradient(135deg,#ef4444,#ec4899)',
                    color: '#fff', fontSize: 10, fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 4px', border: '1.5px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Scrollable Content ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        {title && (
          <div style={{ padding: '24px 20px 8px' }}>
            <h1 style={{ 
              fontSize: 34, 
              fontWeight: 900, 
              letterSpacing: '-0.05em', 
              margin: 0,
              background: 'linear-gradient(to right, var(--foreground), var(--muted))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {title}
            </h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
