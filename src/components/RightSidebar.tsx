'use client';

import React, { useState, useEffect } from 'react';
import { Clock, ShoppingBag, Mail, Gift, Star, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useRecentViewed } from '@/lib/recent-viewed-context';
import { useFavourites } from '@/lib/favourites-context';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const ParticleEffect = ({ emojis, trigger }: { emojis: string[], trigger: boolean }) => {
  const [particles, setParticles] = useState<{ id: number, x: number, y: number, emoji: string }[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 8 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 100,
        y: -Math.random() * 100 - 50,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
      }));
      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1000);
    }
  }, [trigger, emojis]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
      <AnimatePresence>
        {particles.map(p => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
            animate={{ 
              opacity: 0, 
              x: p.x, 
              y: p.y, 
              scale: [0, 1.5, 1],
              rotate: p.x * 2 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ position: 'absolute', left: '50%', top: '20%', fontSize: '20px' }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

interface RightSidebarProps {
  onOpenCart: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onOpenCart }) => {
  const { items, itemCount, totalPrice } = useCart();
  const { recentProducts } = useRecentViewed();
  const { favourites, count: favCount } = useFavourites();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [bagTrigger, setBagTrigger] = useState(false);
  const [favTrigger, setFavTrigger] = useState(false);

  return (
    <aside className="flex flex-col gap-4 h-full">
      {/* Cart Summary Widget */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-card backdrop-blur-md border border-border rounded-2xl p-5 shadow-xl relative overflow-visible"
      >
        <ParticleEffect emojis={['🛍️', '💸', '✨', '🔥']} trigger={bagTrigger} />
        <button 
          onClick={() => {
            setBagTrigger(prev => !prev);
            onOpenCart();
          }}
          className="flex items-center gap-2 mb-4 w-full group transition-all"
        >
          <motion.div
            whileTap={{ scale: 0.8, rotate: -15 }}
          >
            <ShoppingBag size={16} className="text-pink-400 group-hover:scale-110 transition-transform" />
          </motion.div>
          <span className="text-sm font-black uppercase tracking-wider text-foreground group-hover:text-pink-400">Your Bag</span>
          {itemCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-pink-500/20"
            >
              {itemCount}
            </motion.span>
          )}
        </button>
        {items.length === 0 ? (
          <p className="text-muted text-[13px] text-center py-4 italic">Bag is empty</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted/10 overflow-hidden flex-shrink-0 border border-border">
                  {item.thumbnail_url
                    ? <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-muted/20" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-muted">Qty: {item.quantity}</p>
                </div>
                <span className="text-[12px] font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-[11px] text-muted text-center font-bold">+{items.length - 3} MORE ITEMS</p>
            )}
            <div className="border-t border-border pt-3 mt-1 flex justify-between items-center">
              <span className="text-[11px] text-muted font-black uppercase tracking-widest">Total</span>
              <span className="text-[15px] font-black text-emerald-400">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Saved Items Widget (Quick Link) */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-card backdrop-blur-md border border-border rounded-2xl p-5 shadow-xl relative overflow-visible"
      >
        <ParticleEffect emojis={['❤️', '😍', '🔥', '✨']} trigger={favTrigger} />
        <Link 
          href="/favourites" 
          onClick={() => setFavTrigger(prev => !prev)}
          className="flex items-center gap-2 mb-0 group no-underline"
        >
          <motion.div
            whileTap={{ scale: 0.8, rotate: 15 }}
          >
            <Heart size={16} className={`transition-transform group-hover:scale-110 ${favCount > 0 ? 'text-red-400 fill-red-400/20' : 'text-muted'}`} />
          </motion.div>
          <span className="text-sm font-black uppercase tracking-wider text-foreground group-hover:text-red-400 transition-colors">Saved Items</span>
          {favCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto text-[12px] font-black text-muted"
            >
              {favCount}
            </motion.span>
          )}
        </Link>
        {favCount > 0 && (
          <div className="mt-4 flex -space-x-2 overflow-hidden">
            {favourites.slice(0, 4).map((item) => (
              <div key={item.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-card bg-muted/10 overflow-hidden">
                <img src={item.thumbnail_url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            {favCount > 4 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/10 ring-2 ring-card text-[10px] font-bold text-muted">
                +{favCount - 4}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Recently Viewed Widget (Live) */}
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-cyan-400" />
          <span className="text-sm font-black uppercase tracking-wider text-foreground">Recent</span>
        </div>
        {recentProducts.length === 0 ? (
          <p className="text-muted text-[12px] text-center py-2 italic">No history yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentProducts.map((item) => (
              <div key={item.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-muted/10 overflow-hidden flex-shrink-0 border border-border group-hover:scale-105 transition-transform">
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-muted group-hover:text-foreground transition-colors truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-muted font-bold">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promo Box Widget (Stabilized) */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl group min-h-[210px] flex flex-col justify-between">
        {/* Static Background Accent */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3 flex-shrink-0">
            <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20 flex-shrink-0">
              <Gift size={18} className="text-rose-400" />
            </div>
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Exclusives</span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-[13px] font-black text-foreground mb-1.5 leading-tight tracking-tight">
              MEMBER ACCESS
            </h3>
            <p className="text-[11px] text-muted leading-relaxed">
              Join the inner circle and unlock <span className="text-foreground font-bold">20% OFF</span> your first order.
            </p>
          </div>
          
          <button className="w-full py-3 mt-4 bg-foreground text-background text-[10px] font-black rounded-xl hover:opacity-90 transition-all active:scale-[0.98] uppercase tracking-widest flex-shrink-0">
            Sign In to Unlock
          </button>
        </div>
      </div>

      {/* Newsletter Signup Widget */}
      <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Mail size={16} className="text-amber-400" />
          <span className="text-sm font-black uppercase tracking-wider text-foreground">Join the list</span>
        </div>
        <p className="text-[12px] text-muted mb-4">Get the latest drops first.</p>
        {subscribed ? (
          <div className="flex items-center gap-2 justify-center py-2 bg-emerald-500/10 rounded-xl">
            <Star size={14} className="text-emerald-400 fill-emerald-400" />
            <span className="text-[12px] font-black text-emerald-400">YOU'RE IN!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[12px] text-foreground placeholder:text-muted outline-none focus:border-rose-500 transition-colors"
            />
            <button
              onClick={() => email && setSubscribed(true)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-[12px] font-black rounded-xl transition-all shadow-lg active:scale-95"
            >
              SUBSCRIBE
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
