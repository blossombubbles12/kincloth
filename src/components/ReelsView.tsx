'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Heart, Share2, ArrowLeft, 
  Play, Pause, Volume2, VolumeX, Search, Filter 
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useFavourites } from '@/lib/favourites-context';
import Link from 'next/link';

interface ReelItemProps {
  product: Product;
  isActive: boolean;
}

const ReelItem: React.FC<ReelItemProps> = ({ product, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const { addToCart } = useCart();
  const { toggleFavourite, isFavourite } = useFavourites();
  const isLiked = isFavourite(product.id);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      position: 'relative',
      scrollSnapAlign: 'start',
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* ── Background Media ── */}
      {product.video_url ? (
        <video
          ref={videoRef}
          src={product.video_url}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
        />
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={product.thumbnail_url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
          />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            padding: '12px 24px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, fontWeight: 700
          }}>
            No Video Preview
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, padding: '40px 20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 100,
      }}>
        <Link href="/" style={{ 
          display: 'flex', alignItems: 'center', gap: 10,
          color: '#fff', textDecoration: 'none',
          padding: '8px 16px', borderRadius: 100,
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          fontSize: 13, fontWeight: 800,
        }}>
          <ArrowLeft size={20} />
          <span>Exit Reels</span>
        </Link>
        <div style={{ display: 'flex', gap: 16 }}>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            style={{ 
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      {/* ── Overlay: Right Actions (TikTok Style) ── */}
      <div style={{
        position: 'absolute', right: 16, bottom: 120,
        display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center'
      }}>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => toggleFavourite(product)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
        >
          <div style={{ 
            width: 50, height: 50, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'
          }}>
            <Heart size={24} style={{ fill: isLiked ? '#ef4444' : 'none', stroke: isLiked ? '#ef4444' : '#fff' }} />
          </div>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{isLiked ? 'Saved' : 'Save'}</span>
        </motion.button>

        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ 
            width: 50, height: 50, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'
          }}>
            <Share2 size={24} style={{ color: '#fff' }} />
          </div>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>Share</span>
        </button>
      </div>

      {/* ── Overlay: Product Info ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 20px 40px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        display: 'flex', flexDirection: 'column', gap: 16
      }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            {product.name}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, margin: 0, maxWidth: '80%', lineHeight: 1.4 }}>
            {product.description}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>
            ${product.price.toFixed(2)}
          </div>
          <Link 
            href={`/products/${product.id}`}
            style={{ 
              padding: '10px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)', color: '#fff', textDecoration: 'none',
              fontSize: 13, fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            Details
          </Link>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            style={{ 
              flex: 1, padding: '14px', borderRadius: 14, 
              background: '#fff', color: '#000', border: 'none',
              fontSize: 14, fontWeight: 900, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <ShoppingBag size={18} /> Add to Bag
          </motion.button>
        </div>
      </div>

      {/* ── Play/Pause Indicator ── */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            style={{ position: 'absolute', pointerEvents: 'none', color: '#fff', opacity: 0.5 }}
          >
            <Play size={80} fill="white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function ReelsView({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.brand || 'Other')))];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.brand === selectedCategory);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollTop / scrollRef.current.clientHeight);
      setActiveIndex(index);
    }
  };

  return (
    <div style={{ height: '100svh', width: '100%', position: 'relative', backgroundColor: '#000' }}>
      
      {/* ── Filters ── */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0, zIndex: 60,
        display: 'flex', gap: 8, padding: '0 20px', overflowX: 'auto',
        scrollbarWidth: 'none', msOverflowStyle: 'none'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px', borderRadius: 100, whiteSpace: 'nowrap',
              background: selectedCategory === cat ? '#fff' : 'rgba(255,255,255,0.1)',
              color: selectedCategory === cat ? '#000' : '#fff',
              border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              backdropFilter: 'blur(10px)', transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Scroll Container ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          height: '100%',
          width: '100%',
          maxWidth: '500px', // Desktop constraint
          margin: '0 auto',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {filteredProducts.map((product, i) => (
          <ReelItem 
            key={product.id} 
            product={product} 
            isActive={activeIndex === i} 
          />
        ))}

        {filteredProducts.length === 0 && (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            No products in this category
          </div>
        )}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
