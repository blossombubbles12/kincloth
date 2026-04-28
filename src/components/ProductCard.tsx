'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { VideoPlayer } from './VideoPlayer';
import { ShoppingBag, Zap, Share2, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useFavourites } from '@/lib/favourites-context';
import { useHeartBurst } from './HeartAnimation';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  isActive: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isActive }) => {
  const { addToCart, isLoading } = useCart();
  const { toggleFavourite, isFavourite } = useFavourites();
  const { burst } = useHeartBurst();
  const isLiked = isFavourite(product.id);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product);
    setIsAdding(false);
  };

  return (
    <div className="relative w-full h-[100svh] snap-start bg-black flex flex-col overflow-hidden">
      <VideoPlayer 
        src={product.video_url} 
        isActive={isActive} 
        fallbackImage={product.thumbnail_url}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Side Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-10">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            if (!isLiked) burst(e.clientX, e.clientY);
            toggleFavourite(product);
          }}
          className="group flex flex-col items-center gap-1"
        >
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-transform">
            <Heart 
              className={isLiked ? "fill-red-500 stroke-red-500" : "stroke-white"} 
              size={24} 
            />
          </div>
          <span className="text-[10px] text-white font-medium uppercase tracking-wider">Like</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="group flex flex-col items-center gap-1"
        >
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-transform">
            <Share2 className="stroke-white" size={24} />
          </div>
          <span className="text-[10px] text-white font-medium uppercase tracking-wider">Share</span>
        </motion.button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="max-w-[80%] relative">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="pl-4 border-l-2 border-rose-500/50"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-rose-600 to-red-600 rounded text-[10px] text-white font-black uppercase tracking-widest mb-3 inline-block shadow-lg shadow-rose-500/20">
              {product.brand}
            </span>
            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
              {product.name}
            </h2>
            <p className="text-white/70 text-sm line-clamp-2 mb-4 leading-relaxed">
              {product.description}
            </p>
            <div className="text-2xl font-bold text-white mb-6">
              ${product.price.toFixed(2)}
            </div>
          </motion.div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={isAdding || isLoading}
              className="flex-1 bg-white text-black h-14 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-zinc-200 shadow-xl disabled:opacity-50 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isAdding ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Adding...
                  </motion.div>
                ) : (
                  <motion.div
                    key="normal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag size={20} />
                    Add to Bag
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-zinc-900 border border-white/10 text-white rounded-2xl flex items-center justify-center active:scale-[0.98] transition-all hover:bg-zinc-800"
            >
              <Zap size={20} className="fill-yellow-400 stroke-yellow-400" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Interactive elements (Like heart animation) */}
      <AnimatePresence>
        {isLiked && isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <Heart className="fill-red-500 stroke-red-500 w-32 h-32 opacity-20" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
