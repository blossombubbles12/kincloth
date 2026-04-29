'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';

export function AboutSnippet() {
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

        {/* Image Section */}
        <div className="relative aspect-square md:aspect-auto bg-zinc-200">
          <img 
            src="https://images.unsplash.com/photo-1523398002811-999aa8e9f5b9?q=80&w=1200&auto=format&fit=crop" 
            alt="KinCloth Story" 
            className="w-full h-full object-cover grayscale mix-blend-multiply opacity-90"
          />
          <div className="absolute inset-0 bg-[var(--accent)] mix-blend-overlay opacity-30" />
          
          {/* Decorative Badge */}
          <div className="absolute bottom-6 right-6 bg-white text-black px-4 py-2 border-[3px] border-black font-black uppercase tracking-widest text-lg neo-shadow transform rotate-[-3deg]">
            EST. 2026
          </div>
        </div>
      </div>
    </section>
  );
}
