'use client';

import React, { useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartInstance {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  duration: number;
}

interface HeartContextType {
  burst: (x: number, y: number) => void;
}

const HeartContext = createContext<HeartContextType | undefined>(undefined);

export const HeartAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hearts, setHearts] = useState<HeartInstance[]>([]);

  const burst = useCallback((x: number, y: number) => {
    const count = 6;
    const newHearts: HeartInstance[] = [];
    
    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: Date.now() + i,
        x: x + (Math.random() * 40 - 20),
        y: y + (Math.random() * 40 - 20),
        scale: 0.5 + Math.random() * 1,
        rotation: Math.random() * 40 - 20,
        duration: 0.8 + Math.random() * 0.5,
      });
    }

    setHearts(prev => [...prev, ...newHearts]);

    // Clean up hearts after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 2000);
  }, []);

  return (
    <HeartContext.Provider value={{ burst }}>
      {children}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
        <AnimatePresence>
          {hearts.map(heart => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 0, scale: 0, x: heart.x, y: heart.y, rotate: heart.rotation }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: [0, heart.scale, heart.scale * 1.2, heart.scale * 0.8],
                x: heart.x + (Math.random() * 100 - 50),
                y: heart.y - 150 - (Math.random() * 100),
                rotate: heart.rotation + (Math.random() * 40 - 20)
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: heart.duration, ease: "easeOut" }}
              style={{ position: 'absolute', color: '#ef4444' }}
            >
              <Heart size={24} fill="currentColor" stroke="none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </HeartContext.Provider>
  );
};

export const useHeartBurst = () => {
  const context = useContext(HeartContext);
  if (!context) throw new Error('useHeartBurst must be used within HeartAnimationProvider');
  return context;
};
