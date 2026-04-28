'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'New Season Arrivals',
    subtitle: 'Fresh drops every week. Scroll to discover.',
    cta: 'Shop Now',
    gradient: 'from-rose-900 via-red-900 to-black',
    accent: '#818cf8',
    badge: 'NEW IN',
  },
  {
    id: 2,
    title: 'Summer Edit 2026',
    subtitle: 'Light fabrics. Bold statements. Limited stock.',
    cta: 'Explore',
    gradient: 'from-amber-900 via-orange-900 to-black',
    accent: '#fb923c',
    badge: 'TRENDING',
  },
  {
    id: 3,
    title: 'Exclusive Members Deal',
    subtitle: 'Up to 40% off on selected premium styles.',
    cta: 'Claim Offer',
    gradient: 'from-emerald-900 via-teal-900 to-black',
    accent: '#34d399',
    badge: 'LIMITED TIME',
  },
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const go = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  };

  const slide = slides[current];

  return (
    <div className="relative w-full h-64 md:h-[300px] rounded-2xl overflow-hidden bg-black mb-6 select-none shadow-2xl">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: d * 60, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d: number) => ({ x: d * -60, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} flex flex-col justify-center px-10 md:px-16`}
        >
          {/* Badge */}
          <span
            className="inline-block text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 w-fit"
            style={{ background: slide.accent + '30', color: slide.accent, border: `1px solid ${slide.accent}60` }}
          >
            {slide.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-2 tracking-tighter">{slide.title}</h2>
          <p className="text-sm md:text-base text-white/70 mb-6 max-w-md">{slide.subtitle}</p>
          <button
            className="w-fit px-5 py-2 rounded-xl text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95"
            style={{ background: slide.accent }}
          >
            {slide.cta}
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors z-10"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors z-10"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? slide.accent : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
};
