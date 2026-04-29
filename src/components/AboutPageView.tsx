'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Flame, Globe, Scissors } from 'lucide-react';
import { MainLayout } from './MainLayout';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function AboutPageView() {
  const PageContent = () => (
    <div className="flex flex-col w-full">
      {/* ── Hero Statement ── */}
      <section className="px-6 py-20 lg:py-32 border-b-[3px] border-[var(--border)] bg-[var(--accent)] text-black relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Globe size={300} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h1 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-5xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9]"
          >
            WE SET <br className="hidden lg:block" /> THE STANDARD.
          </motion.h1>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl lg:text-3xl font-bold max-w-3xl leading-snug uppercase tracking-tight"
          >
            KinCloth is a culture-driven streetwear brand focused on well-fitted essentials and statement pieces. Built for those who lead, never follow.
          </motion.p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="px-6 py-16 lg:py-24 border-b-[3px] border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="neo-border bg-zinc-200 aspect-square relative overflow-hidden"
          >
            <img src="https://images.unsplash.com/photo-1523398002811-999aa8e9f5b9?q=80&w=2000&auto=format&fit=crop" alt="Our Story" className="w-full h-full object-cover grayscale" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 bg-[var(--accent)] text-black px-4 py-2 font-black uppercase text-2xl border-2 border-black">EST. 2026</div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
          >
            <div className="flex items-center gap-3 mb-6">
              <Flame size={32} className="text-[var(--accent)]" />
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tight">Our Story</h2>
            </div>
            <div className="space-y-6 text-lg lg:text-xl font-medium leading-relaxed text-[var(--muted)]">
              <p>
                We started with a simple realization: the streets were flooded with generic, low-effort apparel. Boxy cuts that didn't fit right, cheap fabrics that fell apart, and designs that meant absolutely nothing.
              </p>
              <p>
                KinCloth was born out of frustration and built on purpose. We didn't want to blend in. We wanted to create pieces that commanded attention.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Our Identity ── */}
      <section className="px-6 py-16 lg:py-24 border-b-[3px] border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-center mb-16 lg:mb-24"
          >
            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tight mb-6">Our Identity</h2>
            <p className="text-xl lg:text-2xl font-bold uppercase tracking-widest text-[var(--muted)]">Raw. Confident. Unapologetic.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Culture", desc: "Rooted in the underground. Inspired by the noise of the city. We don't chase trends; we dictate them." },
              { title: "Individuality", desc: "No two pieces are worn the same way. Our clothing is a canvas for your personal defiance." },
              { title: "Quality", desc: "Heavyweight cottons. Reinforced stitching. Garments engineered to survive the concrete jungle." }
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                variants={fadeIn}
                className="neo-border bg-[var(--background)] p-8 lg:p-12 neo-shadow-hover"
              >
                <h3 className="text-2xl lg:text-3xl font-black uppercase mb-4">{item.title}</h3>
                <p className="text-[var(--muted)] font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Products ── */}
      <section className="px-6 py-16 lg:py-24 border-b-[3px] border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <Scissors size={32} />
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tight">The Fit <br/> Is Everything</h2>
            </div>
            <div className="space-y-6 text-lg lg:text-xl font-medium leading-relaxed text-[var(--muted)] mb-8">
              <p>
                We obsess over the silhouette. A drop-shoulder that sits exactly right. A cargo pant with the perfect taper. Fabric weight that drapes effortlessly.
              </p>
              <p>
                Every seam, every zipper, and every hem is an intentional design choice. This isn't fast fashion. This is wardrobe architecture.
              </p>
            </div>
            <Link href="/shop" className="neo-button inline-flex items-center gap-2 text-lg px-8 py-4">
              <Zap size={20} /> EXPLORE THE COLLECTION
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
            className="order-1 lg:order-2 neo-border bg-zinc-200 aspect-[4/5] relative overflow-hidden"
          >
            <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000&auto=format&fit=crop" alt="Our Products" className="w-full h-full object-cover grayscale" />
          </motion.div>
        </div>
      </section>

      {/* ── Our Vision & CTA ── */}
      <section className="px-6 py-24 lg:py-32 bg-[var(--foreground)] text-[var(--background)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="text-5xl lg:text-8xl font-black uppercase tracking-tight mb-8"
          >
            GLOBAL DOMINATION.
          </motion.h2>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl lg:text-3xl font-bold uppercase tracking-widest text-[var(--muted)] mb-12 leading-snug"
          >
            We are redefining streetwear on a global scale. Join the movement or get out of the way.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeIn}
          >
            <Link href="/shop" className="inline-block bg-[var(--accent)] text-black font-black uppercase tracking-widest text-xl lg:text-2xl px-12 py-6 border-4 border-black neo-shadow-hover hover:bg-white transition-colors">
              SHOP NOW
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );

  return (
    <MainLayout>
      <PageContent />
    </MainLayout>
  );
}
