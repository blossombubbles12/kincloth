'use client';

import React, { useState, useMemo } from 'react';
import { SearchProvider } from '@/lib/search-context';
import { Product } from '@/lib/types';
import { ProductCard, useInfiniteProducts } from './DesktopFeed';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { CartDrawer } from './CartDrawer';
import { CheckoutSheet } from './CheckoutSheet';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { 
  Heart, SlidersHorizontal, LayoutGrid, List, ChevronDown, 
  X, Loader2, Zap, ShoppingBag 
} from 'lucide-react';
import { useFavourites } from '@/lib/favourites-context';
import { MobileView } from './MobileView';
import { Footer } from './Footer';
import Link from 'next/link';
import { ProductCardSkeleton } from './Skeleton';

interface Props {
  initialProducts: Product[];
}

export function ShopPageView({ initialProducts }: Props) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { count: favCount } = useFavourites();
  
  // Use the infinite products hook to get the actual product list
  const { products: allProducts, isLoadingMore, hasMore, bottomRef } = useInfiniteProducts(initialProducts);

  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Shop specific state
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRanges, setPriceRanges] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by Price
    if (priceRanges.length > 0) {
      result = result.filter(p => {
        if (priceRanges.includes('Under $50') && p.price < 50) return true;
        if (priceRanges.includes('$50 - $100') && p.price >= 50 && p.price <= 100) return true;
        if (priceRanges.includes('$100 - $200') && p.price > 100 && p.price <= 200) return true;
        if (priceRanges.includes('Over $200') && p.price > 200) return true;
        return false;
      });
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') result.reverse(); // Mock sort

    return result;
  }, [allProducts, priceRanges, sortBy]);

  const togglePriceRange = (range: string) => {
    setPriceRanges(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  return (
    <SearchProvider products={allProducts}>
      <style>{`
        .sc-mobile-only  { display: block; }
        .sc-desktop-only { display: none; }
        @media (min-width: 1024px) {
          .sc-mobile-only  { display: none !important; }
          .sc-desktop-only { display: flex !important; }
        }
      `}</style>

      {/* ── MOBILE VIEW ── */}
      <div className="sc-mobile-only">
        <MobileView title="Shop" onOpenCart={() => setIsCartOpen(true)}>
          {/* Mobile Filter Bar */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 20,
            background: 'var(--header-bg)', backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border)',
            padding: '12px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
              <button
                onClick={() => setPriceRanges([])}
                style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 10, background: 'var(--card)',
                  border: '1px solid var(--border)', fontSize: 13, fontWeight: 700,
                  color: 'var(--foreground)',
                }}
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
              {['All', ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    flexShrink: 0, padding: '8px 16px', borderRadius: 10,
                    background: selectedCategory === cat ? 'var(--foreground)' : 'var(--card)',
                    border: `1px solid ${selectedCategory === cat ? 'var(--foreground)' : 'var(--border)'}`,
                    fontSize: 13, fontWeight: 700, 
                    color: selectedCategory === cat ? 'var(--background)' : 'var(--muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={`${product.id}-${i}`}
                product={product}
                index={i}
                mobile={true}
              />
            ))}
            {isLoadingMore && [1,2,3].map(n => <ProductCardSkeleton key={`skeleton-${n}`} mobile />)}
          </div>
          <div ref={bottomRef} style={{ height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {!hasMore && filteredProducts.length > 0 && <p style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600 }}>End of Catalog</p>}
          </div>
          <Footer />
        </MobileView>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="sc-desktop-only" style={{ 
        height: '100svh', 
        width: '100%', 
        overflow: 'hidden', 
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* ── Shop Header ── */}
        <header style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--header-bg)',
          backdropFilter: 'blur(20px)',
          zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'var(--accent-foreground)', fontSize: 11, fontWeight: 900 }}>CA</span>
              </div>
              <span style={{ color: 'var(--foreground)', fontSize: 17, fontWeight: 900, letterSpacing: '-0.04em' }}>
                CHI<span style={{ color: 'var(--accent)' }}>ANGEL</span>
              </span>
            </Link>
            <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />
            <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>The Shop</h1>
          </div>

          <div style={{ flex: 1, maxWidth: 500, margin: '0 40px' }}>
            <SearchBar />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            <Link href="/favourites" style={{
              position: 'relative', width: 40, height: 40, borderRadius: 12,
              background: 'var(--card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', color: 'var(--foreground)',
            }}>
              <Heart size={18} style={{ stroke: 'var(--foreground)' }} />
              {favCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  minWidth: 18, height: 18, borderRadius: 9,
                  background: '#ef4444', color: '#fff',
                  fontSize: 10, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', border: '2px solid var(--background)',
                }}>
                  {favCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              style={{
                padding: '10px 20px', background: 'var(--foreground)', color: 'var(--background)',
                border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: 'pointer',
              }}
            >
              Bag
            </button>
          </div>
        </header>

        {/* ── Main Shop Content ── */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '300px 1fr 320px',
          overflow: 'hidden',
          width: '100%',
        }}>
          
          {/* Left: Advanced Filters */}
          <div style={{
            borderRight: '1px solid var(--border)',
            overflowY: 'auto',
            padding: '24px 28px',
            background: 'var(--sidebar)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SlidersHorizontal size={18} className="text-rose-500" />
                <span style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Refine</span>
              </div>
              {(priceRanges.length > 0) && (
                <button 
                  onClick={() => setPriceRanges([])}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Price Filter */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 12, fontWeight: 900, marginBottom: 16, textTransform: 'uppercase', color: 'var(--foreground)', letterSpacing: '0.05em' }}>Price Range</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Under $50', '$50 - $100', '$100 - $200', 'Over $200'].map(range => (
                  <button
                    key={range}
                    onClick={() => togglePriceRange(range)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'none', border: 'none', padding: 0,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 6,
                      border: `2px solid ${priceRanges.includes(range) ? 'var(--accent)' : 'var(--border)'}`,
                      background: priceRanges.includes(range) ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      {priceRanges.includes(range) && <X size={12} color="white" strokeWidth={4} />}
                    </div>
                    <span style={{ 
                      fontSize: 13, 
                      color: priceRanges.includes(range) ? 'var(--foreground)' : 'var(--muted)', 
                      fontWeight: priceRanges.includes(range) ? 800 : 600,
                      transition: 'all 0.2s'
                    }}>{range}</span>
                  </button>
                ))}
              </div>
            </div>

            <LeftSidebar products={allProducts} />
          </div>

          {/* Center: Toolbar + Product Grid */}
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
            
            {/* Shop Toolbar */}
            <div style={{
              padding: '16px 32px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--header-bg)',
              backdropFilter: 'blur(10px)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
                  <span style={{ color: 'var(--foreground)', fontWeight: 800 }}>{filteredProducts.length}</span> products found
                </span>
                <div style={{ width: 1, height: 16, background: 'var(--border)' }} />
                <div style={{ display: 'flex', background: 'var(--card)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
                  <button 
                    onClick={() => setViewType('grid')}
                    style={{ 
                      width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: viewType === 'grid' ? 'var(--background)' : 'transparent',
                      color: viewType === 'grid' ? 'var(--foreground)' : 'var(--muted)',
                      boxShadow: viewType === 'grid' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewType('list')}
                    style={{ 
                      width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: viewType === 'list' ? 'var(--background)' : 'transparent',
                      color: viewType === 'list' ? 'var(--foreground)' : 'var(--muted)',
                      boxShadow: viewType === 'list' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    appearance: 'none',
                    padding: '8px 36px 8px 16px', borderRadius: 10,
                    background: 'var(--card)', border: '1px solid var(--border)',
                    fontSize: 13, fontWeight: 700, color: 'var(--foreground)',
                    cursor: 'pointer', outline: 'none'
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)' }} />
              </div>
            </div>

            {/* Product Grid */}
            <div style={{ padding: 32 }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: viewType === 'grid' ? 'repeat(auto-fill, minmax(240px, 1fr))' : '1fr', 
                gap: 24 
              }}>
                {filteredProducts.map((p, i) => (
                  <ProductCard 
                    key={`${p.id}-${i}`} 
                    product={p} 
                    index={i} 
                    mobile={viewType === 'list'} // Reuse mobile layout for list view
                  />
                ))}
                {isLoadingMore && [1,2,3,4].map(n => (
                  <ProductCardSkeleton key={`skeleton-${n}`} mobile={viewType === 'list'} />
                ))}
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && !isLoadingMore && (
                <div style={{ padding: '80px 0', textAlign: 'center' }}>
                  <div style={{ 
                    width: 80, height: 80, borderRadius: '50%', background: 'var(--card)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                    border: '1px solid var(--border)'
                  }}>
                    <X size={32} style={{ color: 'var(--muted)' }} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--foreground)', margin: '0 0 8px' }}>No products found</h3>
                  <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}

              <div ref={bottomRef} style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 32 }}>
                {!hasMore && filteredProducts.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--muted)' }}>
                    <div style={{ width: 40, height: 1, background: 'var(--border)' }} />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>End of Catalog</span>
                    <div style={{ width: 40, height: 1, background: 'var(--border)' }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{
            borderLeft: '1px solid var(--border)',
            overflowY: 'auto',
            padding: 20,
            background: 'var(--sidebar)',
          }}>
            <RightSidebar onOpenCart={() => setIsCartOpen(true)} />
          </div>

        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      <CheckoutSheet isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      
      <style>{`@keyframes sc-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </SearchProvider>
  );
}
