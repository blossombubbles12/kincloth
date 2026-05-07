'use client';

import React, { useState } from 'react';
import {
  ShoppingBag, Heart, Star, ChevronRight, Share2, Minus, Plus,
  Check, Zap, ShieldCheck, Truck, RefreshCcw
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './DesktopFeed';
import { ProductCardSkeleton } from './Skeleton';
import { useToast } from './ToastContainer';
import { useHeartBurst } from './HeartAnimation';
import { useFavourites } from '@/lib/favourites-context';
import { MainLayout } from './MainLayout';
import Link from 'next/link';

const REVIEWS = [
  { name: 'Alex M.', rating: 5, date: '3 days ago', body: 'Absolutely premium quality. The packaging was immaculate and delivery was lightning fast.' },
  { name: 'Jordan K.', rating: 5, date: '1 week ago', body: 'Exceeded my expectations. Fits perfectly and the material feels incredibly durable.' },
  { name: 'Sam P.', rating: 4, date: '2 weeks ago', body: 'Great product overall. Minor sizing tip: go half a size up for the most comfortable fit.' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { label: 'Onyx Black', hex: '#0a0a0a' },
  { label: 'Ivory Silk', hex: '#fdfbf7' },
  { label: 'Sahara Sand', hex: '#C5A059' },
];

interface Props {
  product: Product & { images?: string[]; variants?: any[] };
  allProducts: Product[];
}

function PDPInner({ product, allProducts }: Props) {
  const { addToCart, isLoading, setIsCartOpen } = useCart();
  const { addToast } = useToast();
  const { toggleFavourite, isFavourite } = useFavourites();
  const { burst } = useHeartBurst();
  const isLiked = isFavourite(product.id);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const galleryImages = [
    product.thumbnail_url,
    ...(product.images || []),
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  ].filter(Boolean).slice(0, 4) as string[];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = async () => {
    if (isAdding || isAdded) return;
    
    const variant = product.variants?.find(v => {
      const hasSize = v.options?.some((opt: any) => opt.value === selectedSize);
      const hasColor = v.options?.some((opt: any) => opt.value === selectedColor.label);
      return hasSize && hasColor;
    }) || product.variants?.[0];

    setIsAdding(true);
    await addToCart(product, variant?.id);
    setIsAdding(false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    addToast(`${product.name.toUpperCase()} ADDED TO BAG`, 'success');
  };

  const discountedPrice = (product.price * 1.4).toFixed(2);

  return (
    <div className="flex flex-col w-full bg-[var(--background)]">
      {/* ── Breadcrumbs (Desktop) ── */}
      <div className="hidden lg:block border-b-2 border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-[var(--foreground)] transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-[var(--foreground)]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* ── Left: Gallery ── */}
        <div className="space-y-6">
          <motion.div 
            layoutId={`product-image-${product.id}`}
            className="aspect-[4/5] neo-border bg-[var(--card)] neo-shadow relative overflow-hidden group"
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4 flex flex-col gap-3">
              <button
                onClick={(e) => {
                  burst(e.clientX, e.clientY);
                  toggleFavourite(product);
                }}
                className={`w-12 h-12 neo-border flex items-center justify-center transition-colors ${isLiked ? 'bg-[var(--accent)] text-black' : 'bg-white text-black hover:bg-[var(--accent)]'}`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`aspect-square neo-border overflow-hidden transition-all ${activeImage === img ? 'neo-shadow scale-95 border-[var(--accent)]' : 'opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-tighter border-2 border-black">
                {product.brand || 'KINCLOTH'}
              </span>
              <div className="flex items-center gap-1 text-[var(--accent)]">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                <span className="ml-1 text-xs font-black text-[var(--foreground)]">4.9 (128)</span>
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl lg:text-4xl font-black tracking-tighter">${product.price.toFixed(2)}</span>
              <span className="text-lg lg:text-xl text-[var(--muted)] font-bold line-through tracking-tighter">${discountedPrice}</span>
              <span className="bg-[var(--accent)] text-black px-2 py-0.5 neo-border text-[10px] font-black uppercase">
                -30% OFF
              </span>
            </div>
          </div>

          <p className="text-sm md:text-base font-bold leading-relaxed text-[var(--muted)] border-l-4 border-black pl-6 py-2 uppercase tracking-tight">
            {product.description}
          </p>

          <div className="space-y-8 py-8 border-y-2 border-black border-dashed">
            {/* Color Select */}
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-widest block">
                Select Color: <span className="text-[var(--accent)]">{selectedColor.label}</span>
              </span>
              <div className="flex gap-4">
                {COLORS.map(color => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 neo-border transition-all ${selectedColor.hex === color.hex ? 'neo-shadow scale-110' : 'hover:scale-105'}`}
                    style={{ background: color.hex }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Size Select */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest">Select Size</span>
                <button className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-[var(--accent)] transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 neo-border font-black text-sm transition-all ${selectedSize === size ? 'bg-black text-white neo-shadow scale-95' : 'bg-white text-black hover:bg-[var(--accent)]'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex items-center h-14 neo-border bg-white px-4 gap-6">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="hover:text-[var(--accent)] transition-colors"><Minus size={20} /></button>
              <span className="w-8 text-center font-black text-lg">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="hover:text-[var(--accent)] transition-colors"><Plus size={20} /></button>
            </div>
            
            <button
              onClick={(e) => {
                burst(e.clientX, e.clientY);
                handleAddToCart();
              }}
              disabled={isLoading || isAdding || isAdded}
              className={`flex-1 h-14 neo-button text-base flex items-center justify-center gap-3 ${isAdded ? 'bg-green-500' : ''}`}
            >
              {isAdded ? <Check size={22} /> : <ShoppingBag size={22} />}
              {isAdding ? 'ADDING...' : isAdded ? 'ADDED' : 'ADD TO BAG'}
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              { icon: <Truck size={18} />, text: 'FREE SHIPPING' },
              { icon: <RefreshCcw size={18} />, text: '30D RETURNS' },
              { icon: <ShieldCheck size={18} />, text: 'SECURE CHECKOUT' },
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest bg-[var(--card)] p-3 neo-border">
                {benefit.icon}
                {benefit.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews & Related ── */}
      <section className="border-t-[3px] border-black bg-[var(--sidebar)] py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Reviews</h2>
              <button className="neo-button text-[10px] py-2">Write Review</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {REVIEWS.map((review, i) => (
                <div key={i} className="neo-border bg-white p-8 neo-shadow-hover space-y-4">
                  <div className="flex gap-1 text-[var(--accent)]">
                    {Array.from({ length: review.rating }).map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm font-bold uppercase tracking-tight leading-relaxed italic">"{review.body}"</p>
                  <div className="pt-4 border-t border-black border-dashed flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase">{review.name}</span>
                    <span className="text-[10px] font-bold text-[var(--muted)]">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">You Might Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
              ) : (
                [1,2,3,4].map(n => <ProductCardSkeleton key={n} />)
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export function ProductDetailsView({ product, allProducts }: Props) {
  return (
    <MainLayout products={allProducts}>
      <PDPInner product={product} allProducts={allProducts} />
    </MainLayout>
  );
}
