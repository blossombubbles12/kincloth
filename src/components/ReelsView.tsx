'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Heart, Share2, ArrowLeft, 
  Play, Pause, Volume2, VolumeX, Search, X, 
  SlidersHorizontal 
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { useFavourites } from '@/lib/favourites-context';
import { useHeartBurst } from './HeartAnimation';
import Link from 'next/link';

interface ReelItemProps {
  product: Product;
  isActive: boolean;
  isMuted: boolean;
}

const ReelItem: React.FC<ReelItemProps> = ({ product, isActive, isMuted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { addToCart } = useCart();
  const { toggleFavourite, isFavourite } = useFavourites();
  const { burst } = useHeartBurst();
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
    <div className="h-full w-full relative snap-start bg-black flex items-center justify-center overflow-hidden">
      {/* ── Background Media ── */}
      {product.video_url ? (
        <video
          ref={videoRef}
          src={product.video_url}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
        />
      ) : (
        <div className="relative w-full h-full">
          <img
            src={product.thumbnail_url}
            alt={product.name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border-[3px] border-white text-white px-6 py-3 font-black text-xs uppercase tracking-widest">
            No Video Preview
          </div>
        </div>
      )}

      {/* ── Overlay: Right Actions (TikTok Style) ── */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-50">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            if (!isLiked) burst(e.clientX, e.clientY);
            toggleFavourite(product);
          }}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`w-12 h-12 border-[3px] border-white flex items-center justify-center transition-colors ${isLiked ? 'bg-[#ffff00]' : 'bg-black group-hover:bg-[#ffff00]'}`}>
            <Heart size={20} fill={isLiked ? 'black' : 'none'} className={isLiked ? 'text-black' : 'text-white group-hover:text-black'} />
          </div>
          <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
            {isLiked ? 'Saved' : 'Save'}
          </span>
        </motion.button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="w-12 h-12 bg-black border-[3px] border-white flex items-center justify-center group-hover:bg-[#ffff00] transition-colors">
            <Share2 size={20} className="text-white group-hover:text-black" />
          </div>
          <span className="text-white text-[10px] font-bold uppercase tracking-widest drop-shadow-md">Share</span>
        </button>
      </div>

      {/* ── Overlay: Product Info ── */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pt-20 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-4 z-40">
        <div>
          <h2 className="text-white text-2xl font-black tracking-tight uppercase leading-tight mb-2">
            {product.name}
          </h2>
          <p className="text-white/80 text-xs font-medium max-w-[80%] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xl font-black text-[#ffff00] bg-black px-3 py-1 border-[3px] border-[#ffff00]">
            ${product.price.toFixed(0)}
          </div>
          <Link 
            href={`/products/${product.id}`}
            className="px-4 py-3 bg-black border-[3px] border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-[#ffff00] hover:border-[#ffff00] hover:text-black transition-colors"
          >
            Details
          </Link>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              burst(e.clientX, e.clientY);
              addToCart(product);
            }}
            className="flex-1 px-4 py-3 bg-[#ffff00] border-[3px] border-[#ffff00] text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-colors"
          >
            <ShoppingBag size={16} /> Add to Bag
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
            className="absolute pointer-events-none z-50 mix-blend-difference"
          >
            <Play size={80} className="text-white" fill="white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useSearchParams } from 'next/navigation';

export function ReelsView({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  // Sync with URL
  useEffect(() => {
    const category = searchParams.get('category') || 'All';
    setSelectedCategory(category);
  }, [searchParams]);
  const [isMuted, setIsMuted] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Hoodies', 'Bottoms', 'T-Shirts', 'Accessories', 'Activewear', 'Plain Tees'];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollTop / scrollRef.current.clientHeight);
      setActiveIndex(index);
    }
  };

  return (
    <div className="h-[100svh] w-full relative bg-black font-sans overflow-hidden">
      
      {/* ── Global Reels Header ── */}
      <div className="absolute top-0 left-0 right-0 p-6 pt-10 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-[70]">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 bg-black border-[3px] border-white text-white px-4 py-2 hover:bg-[#ffff00] hover:text-black transition-colors">
            <ArrowLeft size={16} />
            <span className="font-bold text-xs uppercase tracking-widest">Exit</span>
          </Link>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`w-10 h-10 border-[3px] flex items-center justify-center transition-colors ${isFilterOpen ? 'bg-[var(--accent)] border-[var(--accent)] text-black' : 'bg-black border-white text-white hover:bg-[#ffff00] hover:text-black'}`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-10 h-10 bg-black border-[3px] border-white text-white flex items-center justify-center hover:bg-[#ffff00] hover:text-black transition-colors"
          >
            {isSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 bg-black border-[3px] border-white text-white flex items-center justify-center hover:bg-[#ffff00] hover:text-black transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* ── Search Overlay ── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-28 left-6 right-6 z-[80]"
          >
            <div className="neo-border bg-[var(--background)] p-4 neo-shadow">
              <SearchBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Category Drawer Overlay ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[75]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[80%] max-w-xs bg-black border-r-[3px] border-white z-[80] p-8 pt-28 flex flex-col gap-6"
            >
              <h3 className="text-[#ffff00] text-xl font-black uppercase tracking-tighter border-b-2 border-[#ffff00] pb-2">Categories</h3>
              <div className="flex flex-col gap-3 overflow-y-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsFilterOpen(false);
                    }}
                    className={`text-left py-4 px-6 neo-border font-black uppercase tracking-widest text-sm transition-colors ${
                      selectedCategory === cat 
                        ? 'bg-[var(--accent)] text-black border-[var(--accent)]' 
                        : 'bg-black text-white border-white hover:bg-[#ffff00] hover:text-black hover:border-[#ffff00]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Scroll Container ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full w-full max-w-[500px] mx-auto overflow-y-auto snap-y snap-mandatory hide-scrollbar"
      >
        {filteredProducts.map((product, i) => (
          <ReelItem 
            key={product.id} 
            product={product} 
            isActive={activeIndex === i} 
            isMuted={isMuted}
          />
        ))}

        {filteredProducts.length === 0 && (
          <div className="h-full flex items-center justify-center bg-black text-[#ffff00] font-black uppercase tracking-widest">
            No products in this category
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
