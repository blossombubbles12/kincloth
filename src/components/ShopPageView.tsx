'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';
import { ProductCard, useInfiniteProducts } from './DesktopFeed';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { 
  SlidersHorizontal, LayoutGrid, List, ChevronDown, 
  X 
} from 'lucide-react';
import { ProductCardSkeleton } from './Skeleton';
import { MainLayout } from './MainLayout';

interface Props {
  initialProducts: Product[];
}

export function ShopPageView({ initialProducts }: Props) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Use the infinite products hook to get the actual product list
  const { products: allProducts, isLoadingMore, hasMore, bottomRef } = useInfiniteProducts(initialProducts);

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
    <MainLayout products={allProducts}>
      {/* ── MOBILE VIEW ── */}
      <div className="sc-mobile-only">
        {/* ── Filter Bar ── */}
        <div className="sticky top-[60px] z-20 bg-[var(--header-bg)] border-b-[2px] border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 neo-border text-[11px] font-black uppercase tracking-widest transition-colors ${
                priceRanges.length > 0 ? 'bg-[var(--accent)] text-black' : 'bg-[var(--card)] hover:bg-[var(--accent)] hover:text-black'
              }`}
            >
              <SlidersHorizontal size={12} /> Filter{priceRanges.length > 0 ? ` (${priceRanges.length})` : ''}
            </button>
            <div className="w-[1px] h-4 bg-[var(--border)] flex-shrink-0 mx-1" />
            {['All', ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as string)}
                className={`flex-shrink-0 px-3 py-1.5 neo-border text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-[var(--card)] text-[var(--muted)] hover:border-[var(--accent)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Sort Row ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--sidebar)] border-b-[2px] border-[var(--border)]">
          <span className="text-[10px] text-[var(--muted)] font-black uppercase tracking-widest">
            <span className="text-[var(--foreground)]">{filteredProducts.length}</span> Results
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-[10px] font-black uppercase tracking-widest bg-[var(--card)] neo-border px-2 py-1 outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
            </select>
          </div>
        </div>

        {/* ── Product Grid ── */}
        <div className="p-3 grid grid-cols-2 gap-3 bg-[var(--background)]">
          {filteredProducts.map((product, i) => (
            <ProductCard
              key={`${product.id}-${i}`}
              product={product}
              index={i}
            />
          ))}
          {isLoadingMore && [1, 2, 3, 4].map(n => <ProductCardSkeleton key={`skeleton-${n}`} />)}
        </div>

        {/* ── End sentinel ── */}
        <div ref={bottomRef} className="h-24 flex flex-col items-center justify-center gap-4 border-t-[var(--border-width)] border-[var(--border)] border-dashed mt-8">
          {!hasMore && filteredProducts.length > 0 ? (
            <>
              <div className="w-8 h-[2px] bg-[var(--accent)]" />
              <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.2em]">End of Collection</p>
            </>
          ) : (
             <div className="flex items-center gap-2 text-[var(--muted)]">
                <div className="w-4 h-4 border-2 border-[var(--muted)] border-t-transparent animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest">Loading...</span>
             </div>
          )}
        </div>

        {/* ── Filter Drawer (slide-up) ── */}
        <AnimatePresence>
          {isFilterOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 z-[90] bg-black/60"
              />
              {/* Panel */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                className="fixed bottom-0 left-0 right-0 z-[100] bg-[var(--background)] border-t-[3px] border-[var(--border)] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b-[3px] border-[var(--border)]">
                  <span className="text-sm font-black uppercase tracking-widest">Filter</span>
                  <div className="flex gap-2">
                    {(priceRanges.length > 0) && (
                      <button
                        onClick={() => setPriceRanges([])}
                        className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 neo-border bg-[var(--accent)] text-black"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-9 h-9 neo-border bg-[var(--card)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-black transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
                  {/* Price Range */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-4 pb-2 border-b-2 border-[var(--border)]">Price Range</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Under $50', '$50 - $100', '$100 - $200', 'Over $200'].map(range => (
                        <button
                          key={range}
                          onClick={() => togglePriceRange(range)}
                          className={`px-3 py-3 neo-border text-xs font-bold uppercase tracking-wide text-left transition-colors ${
                            priceRanges.includes(range)
                              ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                              : 'bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)]'
                          }`}
                        >
                          {priceRanges.includes(range) ? '✓ ' : ''}{range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-4 pb-2 border-b-2 border-[var(--border)]">Category</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['All', ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat as string)}
                          className={`px-3 py-3 neo-border text-xs font-bold uppercase tracking-wide text-left transition-colors ${
                            selectedCategory === cat
                              ? 'bg-[var(--foreground)] text-[var(--background)]'
                              : 'bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)]'
                          }`}
                        >
                          {selectedCategory === cat ? '✓ ' : ''}{cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply */}
                <div className="p-4 border-t-[3px] border-[var(--border)]">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full neo-button py-3 text-sm font-black uppercase tracking-widest"
                  >
                    Show {filteredProducts.length} Results
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="sc-desktop-only hidden lg:flex flex-col w-full bg-[var(--background)] overflow-hidden h-[calc(100vh-64px)]">
        
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
                <SlidersHorizontal size={18} style={{ color: 'var(--accent)' }} />
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
            <RightSidebar onOpenCart={() => {}} />
          </div>

        </div>
      </div>
      
      <style>{`@keyframes sc-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
    </MainLayout>
  );
}
