'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Flame, Clock } from 'lucide-react';
import { ProductCard, useInfiniteProducts } from './DesktopFeed';
import { Product } from '@/lib/types';
import { MainLayout } from './MainLayout';

export function NewArrivalsPageView({ initialProducts }: { initialProducts: Product[] }) {
  const { products } = useInfiniteProducts(initialProducts);
  const newProducts = products.slice(0, 4);

  const Ticker = () => (
    <div className="w-full bg-[var(--accent)] border-b-[3px] border-[var(--border)] overflow-hidden flex whitespace-nowrap py-2 items-center">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
        className="flex gap-12 font-black uppercase tracking-widest text-xs lg:text-sm text-black"
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="flex items-center gap-2">
            <Flame size={14} /> NEW DROPS LIVE
            <span className="mx-6">///</span>
            LIMITED QUANTITIES
            <span className="mx-6">///</span>
            NO RESTOCKS
          </span>
        ))}
      </motion.div>
    </div>
  );

  return (
    <MainLayout products={initialProducts}>
      <div className="flex flex-col w-full">
        <Ticker />

        {/* ── Drop Hero ── */}
        <section className="px-6 py-12 lg:py-24 border-b-[3px] border-[var(--border)] bg-[var(--card)] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 border-[3px] border-black neo-shadow uppercase font-black text-xs tracking-widest mb-8">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Drop 004 is Live
            </div>

            <h1 className="text-5xl lg:text-8xl font-black uppercase tracking-tight mb-6 leading-none">
              THE TOKYO <br /> SYNDICATE
            </h1>

            <p className="text-lg lg:text-xl font-bold uppercase tracking-widest text-[var(--muted)] mb-10 max-w-2xl mx-auto">
              Heavyweight technical garments engineered for the urban sprawl. Once they are gone, they are archived forever.
            </p>

            {/* Fake Countdown */}
            <div className="flex items-center gap-4 lg:gap-8 justify-center">
              {[{ label: 'DAYS', val: '00' }, { label: 'HRS', val: '12' }, { label: 'MINS', val: '45' }, { label: 'SECS', val: '30' }].map((time, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-14 h-14 lg:w-20 lg:h-20 neo-border bg-[var(--background)] flex items-center justify-center text-2xl lg:text-4xl font-black mb-2 neo-shadow">
                    {time.val}
                  </div>
                  <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{time.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Products Grid ── */}
        <section className="px-6 py-16 lg:py-24 bg-[var(--background)] border-b-[3px] border-[var(--border)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10 pb-4 border-b-[3px] border-[var(--border)]">
              <h2 className="text-3xl font-black uppercase tracking-tight">The Collection</h2>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Clock size={16} /> 4 Items Left
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newProducts.map((product, i) => (
                <ProductCard key={`${product.id}-${i}`} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Lookbook Teaser ── */}
        <section className="px-6 py-16 lg:py-24 bg-zinc-900 text-white border-b-[3px] border-[var(--border)] relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tight mb-6 leading-none">View The <br /> Lookbook</h2>
              <p className="text-zinc-400 font-medium text-lg leading-relaxed mb-8 max-w-md">
                Dive deep into the aesthetic vision behind Drop 004. Shot on location in Shinjuku, Tokyo.
              </p>
              <Link href="/about" className="neo-button inline-flex items-center gap-2 bg-white text-black hover:bg-[var(--accent)] hover:text-black text-sm px-6 py-3 border-white neo-shadow-hover">
                EXPLORE EDITORIAL <ArrowLeft size={16} />
              </Link>
            </div>
            <div className="relative aspect-video bg-zinc-800 neo-border border-white overflow-hidden transform rotate-2 neo-shadow">
              <img src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1000&auto=format&fit=crop" alt="Lookbook" className="w-full h-full object-cover grayscale opacity-80" />
              <div className="absolute inset-0 bg-white mix-blend-overlay opacity-10" />
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
