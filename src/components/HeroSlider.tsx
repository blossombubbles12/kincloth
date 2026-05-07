'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    tag: 'New Season',
    title: 'Raw Streetwear',
    sub: 'Unapologetic. Unfiltered. Unyielding.',
    cta: 'Shop Collection',
    href: '/shop',
    video: 'https://res.cloudinary.com/dtw0ajpwa/video/upload/v1778153126/kincloth6_lzl4i6.mp4',
  },
  {
    id: 2,
    tag: 'Limited Drop',
    title: 'The Noir Edit',
    sub: 'Deep blacks. Hard edges. Zero compromise.',
    cta: 'View Drop',
    href: '/drops',
    video: 'https://res.cloudinary.com/dtw0ajpwa/video/upload/v1778153099/kincloth8_wlomxm.mp4',
  },
  {
    id: 3,
    tag: 'Culture',
    title: 'Disrupt 2026',
    sub: 'The culture has no rules. Neither do we.',
    cta: 'Explore',
    href: '/shop',
    video: 'https://res.cloudinary.com/dtw0ajpwa/video/upload/v1778153094/kincloth7_zzmecc.mp4',
  },
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (isPlaying) {
      t = setInterval(() => setCurrent(p => (p + 1) % slides.length), 8000);
    }
    return () => clearInterval(t);
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [current]);

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden neo-border neo-shadow h-[400px] sm:h-[520px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col md:flex-row"
        >
          {/* Left: Text */}
          <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 w-full md:w-1/2 bg-[var(--background)] h-1/2 md:h-full border-b-[3px] md:border-b-0 border-[var(--border)]">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4 px-3 py-1 border-[var(--border-width)] border-[var(--border)] w-fit">
              {slide.tag}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4">
              {slide.title}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[var(--muted)] mb-8 max-w-xs leading-relaxed">
              {slide.sub}
            </p>
            <Link href={slide.href} className="neo-button flex items-center gap-3 w-fit group">
              {slide.cta}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Video */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full relative md:border-l-[3px] border-[var(--border)] bg-black group">
            <video
              ref={videoRef}
              src={slide.video}
              key={slide.video}
              className="w-full h-full object-cover transition-all duration-700"
              autoPlay
              muted
              loop
              playsInline
            />
            
            {/* Play/Pause Overlay */}
            <button 
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) videoRef.current.pause();
                  else videoRef.current.play();
                  setIsPlaying(!isPlaying);
                }
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[var(--accent)] border-[3px] border-black flex items-center justify-center neo-shadow opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 z-20"
            >
              {isPlaying ? <Pause size={24} className="text-black" /> : <Play size={24} className="text-black ml-1" />}
            </button>

            {/* Yellow accent block */}
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#ffff00] border-r-[3px] border-t-[3px] border-[var(--border)] hidden md:block" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide counter */}
      <div className="absolute bottom-6 left-8 md:left-12 flex items-center gap-4 z-20">
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
