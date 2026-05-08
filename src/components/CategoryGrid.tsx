'use client';

import React from 'react';
import Link from 'next/link';

interface CategoryBlock {
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  comingSoon?: boolean;
}

const CATEGORY_BLOCKS: CategoryBlock[] = [
  {
    title: 'HEAVYWEIGHT HOODIES',
    image: 'https://res.cloudinary.com/dtw0ajpwa/image/upload/v1778226183/kincloth_hooodie_lofifn.jpg',
    href: '/shop?category=Hoodies',
    comingSoon: true,
  },
  {
    title: 'TACTICAL CARGOS',
    image: 'https://res.cloudinary.com/dtw0ajpwa/image/upload/v1778190159/kinclothcargo_o5kqf2.jpg',
    href: '/shop?category=Bottoms',
  },
  {
    title: 'ESSENTIAL TEES',
    image: 'https://res.cloudinary.com/dtw0ajpwa/image/upload/v1778230460/kincloth_essentials_bjuxb0.jpg',
    href: '/shop?category=T-Shirts',
  },
  {
    title: 'ACCESSORIES',
    image: 'https://res.cloudinary.com/dtw0ajpwa/image/upload/v1778225954/kincloth_accessories_hsk1y7.jpg',
    href: '/shop?category=Accessories',
  },
  {
    title: 'PERFORMANCE ACTIVEWEAR',
    image: 'https://res.cloudinary.com/dtw0ajpwa/image/upload/v1778225792/kincloth_active_wear_yiokp6.jpg',
    href: '/shop?category=Activewear',
  },
  {
    title: 'PLAIN TEES',
    image: 'https://res.cloudinary.com/dtw0ajpwa/image/upload/v1778229360/kincloth_tshirt_m2ovn5.jpg',
    href: '/shop?category=Plain Tees',
  }
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
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
            {block.comingSoon && (
              <span className="inline-block bg-[#ffff00] text-black text-[9px] font-black px-2 py-0.5 mb-2 border border-black">
                COMING SOON
              </span>
            )}
            <h3 className="text-white text-base sm:text-lg md:text-xl font-black uppercase tracking-tight leading-none group-hover:text-[#ffff00] transition-colors">
              {block.title}
            </h3>
            {block.subtitle && (
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">
                {block.subtitle}
              </p>
            )}
            <div className="h-1 w-6 sm:w-8 bg-white mt-2 sm:mt-3 group-hover:bg-[#ffff00] group-hover:w-16 transition-all duration-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}
