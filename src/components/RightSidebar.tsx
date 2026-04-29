'use client';

import React, { useState } from 'react';
import { Clock, ShoppingBag, Mail, Gift, Zap, Heart, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useRecentViewed } from '@/lib/recent-viewed-context';
import { useFavourites } from '@/lib/favourites-context';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const RightSidebar: React.FC<{ onOpenCart: () => void }> = ({ onOpenCart }) => {
  const { items, itemCount, totalPrice, removeFromCart } = useCart();
  const { recentProducts } = useRecentViewed();
  const { count: favCount } = useFavourites();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      {/* Quick Bag Summary */}
      <section className="neo-border bg-white p-6 neo-shadow">
        <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <h3 className="text-xl font-black tracking-tighter">YOUR BAG</h3>
          </div>
          <span className="bg-[#ffff00] px-2 font-black border-2 border-black">
            {itemCount}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="font-medium text-center py-4 opacity-40 uppercase text-xs tracking-widest">Bag is empty</p>
        ) : (
          <div className="space-y-4">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-14 h-14 neo-border overflow-hidden flex-shrink-0">
                  <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase leading-tight truncate">{item.name}</p>
                  <p className="text-xs font-bold opacity-50">${item.price.toFixed(0)} × {item.quantity}</p>
                </div>
                <button 
                  onClick={() => item.line_item_id && removeFromCart(item.line_item_id)}
                  className="text-black hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-[10px] font-black text-center opacity-50">+{items.length - 3} MORE ITEMS</p>
            )}
            <div className="border-t-2 border-black pt-4 flex justify-between items-center bg-[#f0f0f0] p-2">
              <span className="font-black text-xs">TOTAL</span>
              <span className="font-black text-lg">${totalPrice.toFixed(0)}</span>
            </div>
            <button 
              onClick={onOpenCart}
              className="w-full neo-button py-3 text-sm mt-2"
            >
              OPEN FULL BAG
            </button>
          </div>
        )}
      </section>

      {/* Community / Saved Link */}
      <Link href="/favourites" className="neo-border bg-[#ffff00] p-6 neo-shadow block group hover:translate-x-1 hover:translate-y-1 transition-transform">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart size={20} className={favCount > 0 ? "fill-black" : ""} />
            <h3 className="font-black text-lg tracking-tighter uppercase">Wishlist</h3>
          </div>
          <span className="font-bold text-xl">({favCount})</span>
        </div>
      </Link>

      {/* Activity / Recents */}
      <section className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock size={18} />
          <h3 className="font-bold text-sm uppercase tracking-widest">Recently Viewed</h3>
        </div>
        <div className="space-y-4">
          {recentProducts.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-4 group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 neo-border overflow-hidden flex-shrink-0">
                <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase truncate group-hover:bg-[#ffff00] px-1 w-fit">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RAW NEWSLETTER */}
      <section className="bg-black text-white p-8 neo-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffff00] translate-x-12 -translate-y-12 rotate-45 group-hover:translate-x-10 transition-transform" />
        <h4 className="font-bold text-lg tracking-tight mb-4 leading-none">The Inside Line</h4>
        <p className="text-xs font-bold opacity-60 mb-6 uppercase tracking-widest leading-relaxed">Early drops. Raw updates. No polish.</p>
        
        {subscribed ? (
          <div className="bg-[#ffff00] text-black p-3 font-black text-center text-sm rotate-2">
            ON THE LIST.
          </div>
        ) : (
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="EMAIL" 
              className="w-full bg-white text-black p-3 font-black text-sm outline-none border-b-4 border-[#ffff00] placeholder:opacity-30"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button 
              onClick={() => email && setSubscribed(true)}
              className="w-full bg-[#ffff00] text-black font-black py-3 text-sm hover:translate-x-1 hover:translate-y-1 transition-transform"
            >
              JOIN THE CHAOS
            </button>
          </div>
        )}
      </section>


    </div>
  );
};
