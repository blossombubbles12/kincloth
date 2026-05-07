'use client';

import React from 'react';
import Link from 'next/link';

const CATEGORY_BLOCKS = [
  {
    title: 'HEAVYWEIGHT HOODIES',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    href: '/shop?category=Hoodies',
  },
  {
    title: 'TACTICAL CARGOS',
    image: 'https://images.unsplash.com/photo-1628751508670-659779d77fbc?q=80&w=800&auto=format&fit=crop',
    href: '/shop?category=Bottoms',
  },
  {
    title: 'ESSENTIAL TEES',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    href: '/shop?category=T-Shirts',
  },
  {
    title: 'HARDWARE & CAPS',
    image: 'https://images.unsplash.com/photo-1556306535-0f09a536f0bl?q=80&w=800&auto=format&fit=crop',
    href: '/shop?category=Headwear',
  }
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
      {CATEGORY_BLOCKS.map((block, i) => (
        <Link 
          key={i} 
          href={block.href}
          className="group relative aspect-[4/5] bg-black neo-border neo-shadow overflow-hidden block"
        >
          {/* Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
            style={{ backgroundImage: `url(${block.image})` }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <h3 className="text-white text-base sm:text-lg md:text-xl font-black uppercase tracking-tight leading-none group-hover:text-[#ffff00] transition-colors">
              {block.title}
            </h3>
            <div className="h-1 w-6 sm:w-8 bg-white mt-2 sm:mt-3 group-hover:bg-[#ffff00] group-hover:w-16 transition-all duration-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}
