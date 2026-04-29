'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    tag: 'New Season',
    title: 'Raw Streetwear',
    sub: 'Unapologetic. Unfiltered. Unyielding.',
    cta: 'Shop Collection',
    href: '/shop',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1400&q=80',
  },
  {
    id: 2,
    tag: 'Limited Drop',
    title: 'The Noir Edit',
    sub: 'Deep blacks. Hard edges. Zero compromise.',
    cta: 'View Drop',
    href: '/drops',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80',
  },
  {
    id: 3,
    tag: 'Culture',
    title: 'Disrupt 2026',
    sub: 'The culture has no rules. Neither do we.',
    cta: 'Explore',
    href: '/shop',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400&q=80',
  },
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden neo-border neo-shadow" style={{ height: 480 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex"
        >
          {/* Left: Text */}
          <div className="relative z-10 flex flex-col justify-center px-12 md:px-16 w-full md:w-1/2 bg-[var(--background)]">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4 px-3 py-1 border-2 border-[var(--border)] w-fit">
              {slide.tag}
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4">
              {slide.title}
            </h1>
            <p className="text-sm font-medium text-[var(--muted)] mb-8 max-w-xs leading-relaxed">
              {slide.sub}
            </p>
            <Link href={slide.href} className="neo-button flex items-center gap-3 w-fit group">
              {slide.cta}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Image */}
          <div className="hidden md:block w-1/2 relative border-l-[3px] border-[var(--border)]">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Yellow accent block */}
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#ffff00] border-r-[3px] border-t-[3px] border-[var(--border)]" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide counter */}
      <div className="absolute bottom-6 left-12 flex items-center gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-0.5 transition-all ${i === current ? 'w-8 bg-[var(--foreground)]' : 'w-4 bg-[var(--muted)]'}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute bottom-4 right-6 flex gap-2 z-20">
        <button
          onClick={() => setCurrent(p => (p - 1 + slides.length) % slides.length)}
          className="w-10 h-10 neo-border bg-[var(--background)] flex items-center justify-center hover:bg-[#ffff00] transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setCurrent(p => (p + 1) % slides.length)}
          className="w-10 h-10 neo-border bg-[var(--background)] flex items-center justify-center hover:bg-[#ffff00] transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
