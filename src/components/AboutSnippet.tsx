'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';

export function AboutSnippet() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.log("Play failed", e));
    }
  };

  useEffect(() => {
    handlePlay();
  }, []);

  return (
    <section className="border-[3px] border-[var(--border)] bg-[var(--card)] my-12 neo-shadow overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Text Section */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[var(--background)] border-b-[3px] md:border-b-0 md:border-r-[3px] border-[var(--border)] relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={24} className="text-[var(--accent)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Our Manifesto</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6 leading-none">
            Built for those who lead, never follow.
          </h2>
          <p className="text-sm lg:text-base font-medium text-[var(--muted)] mb-8 leading-relaxed max-w-md">
            We started with a simple realization: the streets were flooded with generic, low-effort apparel. KinCloth is a culture-driven streetwear brand focused on well-fitted essentials and statement pieces.
          </p>
          <div className="mt-auto">
            <Link 
              href="/about" 
              className="neo-button inline-flex items-center gap-2 text-sm px-6 py-3"
            >
              READ THE FULL STORY <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Video Section */}
        <div className="relative aspect-square md:aspect-auto bg-black overflow-hidden group">
          <video 
            ref={videoRef}
            src="https://res.cloudinary.com/dtw0ajpwa/video/upload/v1778146097/kincloth1_oajsov.mp4"
            className="w-full h-full object-contain transition-all duration-700"
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
            // @ts-ignore
            webkit-playsinline="true"
            preload="auto"
            onLoadedData={handlePlay}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          
          {/* Decorative Badge */}
          <div className="absolute bottom-6 right-6 bg-[var(--accent)] text-black px-4 py-2 border-[3px] border-black font-black uppercase tracking-widest text-lg neo-shadow transform rotate-[-3deg] z-20">
            EST. 2026
          </div>
        </div>
      </div>
    </section>
  );
}
