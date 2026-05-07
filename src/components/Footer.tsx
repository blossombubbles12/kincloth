'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Send, Video, Globe, ArrowRight, ShieldCheck, Truck, RefreshCcw, Zap } from 'lucide-react';

const SHOP_LINKS = ['New Drops', 'Best Sellers', 'Limited Drop', 'Archive', 'Gifts'];
const SUPPORT_LINKS = ['Track Order', 'Returns', 'Size Guide', 'FAQ', 'Contact'];
const COMPANY_LINKS = ['About', 'Careers', 'Press', 'Privacy Policy', 'Terms'];

const SOCIALS = [
  { icon: <Camera size={16} />, href: '#', label: 'Instagram' },
  { icon: <Send size={16} />, href: '#', label: 'Twitter' },
  { icon: <Video size={16} />, href: '#', label: 'TikTok' },
  { icon: <Globe size={16} />, href: '#', label: 'Website' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="border-t-[3px] border-[var(--border)] bg-[var(--sidebar)] text-[var(--foreground)] mt-16">

      {/* Trust Bar */}
      <div className="border-b-[3px] border-[var(--border)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Truck size={18} />, label: 'Fast Shipping', sub: 'Orders ship in 24h' },
            { icon: <RefreshCcw size={18} />, label: '30-Day Returns', sub: 'Hassle-free policy' },
            { icon: <ShieldCheck size={18} />, label: 'Secure Checkout', sub: '256-bit encryption' },
            { icon: <Zap size={18} />, label: 'Drop Alerts', sub: 'Be first to know' },
          ].map(({ icon, label, sub }, i) => (
            <div
              key={label}
              className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-4 sm:py-6 ${i < 3 ? 'border-r-[2px] border-[var(--border)]' : ''} ${i === 1 ? 'border-r-0 sm:border-r-[2px]' : ''}`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 neo-border flex items-center justify-center bg-[var(--accent)] text-black flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">{label}</p>
                <p className="text-[10px] text-[var(--muted)] mt-0.5 hidden sm:block">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12">

        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-1 group mb-6 w-fit">
            <span className="text-xl font-black tracking-tight group-hover:bg-[var(--accent)] group-hover:text-black transition-colors px-1">KIN</span>
            <span className="text-xl font-black tracking-tight group-hover:bg-[var(--accent)] group-hover:text-black transition-colors px-1">CLOTH</span>
          </Link>

          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs mb-8">
            Premium streetwear for the culturally aware. New drops weekly. Built for those who set the standard.
          </p>

          <div className="flex gap-3 mb-10">
            {SOCIALS.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 neo-border flex items-center justify-center text-[var(--muted)] hover:bg-[var(--accent)] hover:text-black transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <p className="text-xs font-bold uppercase tracking-widest mb-3">Get Early Access</p>
          {subscribed ? (
            <div className="neo-border px-4 py-3 text-xs font-bold text-[var(--muted)] bg-[var(--card)]">
              You&apos;re on the list.
            </div>
          ) : (
            <div className="flex gap-0">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && email && setSubscribed(true)}
                placeholder="your@email.com"
                className="neo-input flex-1 text-xs"
              />
              <button
                onClick={() => email && setSubscribed(true)}
                className="neo-button flex items-center gap-1 px-4"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Links */}
        {[
          { title: 'Shop', links: SHOP_LINKS },
          { title: 'Support', links: SUPPORT_LINKS },
          { title: 'Company', links: COMPANY_LINKS },
        ].map(({ title, links }) => (
          <div key={title}>
            <p className="text-xs font-bold uppercase tracking-widest mb-5 pb-2 border-b-2 border-[var(--border)]">{title}</p>
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link}>
                  <Link
                    href={
                      link === 'About' ? '/about' : 
                      link === 'Contact' ? '/contact' : 
                      link === 'Track Order' ? '/track-order' :
                      link === 'FAQ' ? '/faq' :
                      link === 'Privacy Policy' ? '/privacy' : 
                      link === 'Terms' ? '/terms' : 
                      '/shop'
                    }
                    className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] hover:px-1 transition-all"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t-[3px] border-[var(--border)] max-w-7xl mx-auto px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Kincloth. All rights reserved.
        </p>
        <div className="flex gap-2">


          {['VISA', 'MC', 'AMEX', 'PAYPAL'].map(p => (
            <div key={p} className="neo-border px-2 py-1 text-[10px] font-bold bg-[var(--card)] text-[var(--muted)]">{p}</div>
          ))}
        </div>
        <div className="flex gap-6">
          {['Terms', 'Privacy', 'Cookies'].map(item => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
