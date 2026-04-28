'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Camera, Send, Video, Globe,
  Mail, ArrowRight, ShieldCheck, Truck, RefreshCcw,
  Heart, Zap,
} from 'lucide-react';

const SHOP_LINKS = ['New Arrivals', 'Best Sellers', 'Sale', 'Brands', 'Gift Cards'];
const SUPPORT_LINKS = ['Track Order', 'Returns & Exchanges', 'Size Guide', 'FAQ', 'Contact Us'];
const COMPANY_LINKS = ['About Us', 'Careers', 'Press', 'Affiliates', 'Privacy Policy'];

const SOCIALS = [
  { icon: <Camera size={18} />, href: '#', label: 'Instagram' },
  { icon: <Send size={18} />, href: '#', label: 'Twitter' },
  { icon: <Video size={18} />, href: '#', label: 'YouTube' },
  { icon: <Globe size={18} />, href: '#', label: 'Facebook' },
];

const TRUST = [
  { icon: <Truck size={20} />, label: 'Free Shipping', sub: 'On orders over $50' },
  { icon: <RefreshCcw size={20} />, label: '30-Day Returns', sub: 'Hassle-free policy' },
  { icon: <ShieldCheck size={20} />, label: 'Secure Checkout', sub: '256-bit encryption' },
  { icon: <Zap size={20} />, label: 'Fast Delivery', sub: '2–5 business days' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--sidebar)',
      color: 'var(--foreground)',
    }}>

      {/* ── Trust Bar ── */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--card)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '28px 32px',
          display: 'flex', flexWrap: 'wrap', gap: 24,
          justifyContent: 'center'
        }}>
          {TRUST.map(({ icon, label, sub }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              minWidth: 200
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)',
              }}>
                {icon}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 900, color: 'var(--foreground)', margin: 0 }}>{label}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', margin: '2px 0 0', fontWeight: 500 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 32px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 60 }}>

          {/* Brand Column */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(244,63,94,0.2)',
              }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>CA</span>
              </div>
              <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--foreground)' }}>
                CHI<span style={{ color: 'var(--accent)' }}>ANGEL</span>
              </span>
            </div>

            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 400, marginBottom: 28 }}>
              Chiangel — Discover curated premium products with a next-generation scroll feed. New drops every week — built for the modern shopper.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
              {SOCIALS.map(({ icon, href, label }) => (
                <a key={label} href={href} aria-label={label} style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'var(--card)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--muted)', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--accent-foreground)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--card)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--muted)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <p style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--foreground)', marginBottom: 12 }}>
              Get Early Access
            </p>
            {subscribed ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 16px', borderRadius: 14,
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                maxWidth: 300
              }}>
                <Heart size={16} style={{ fill: '#22c55e', stroke: 'none' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>You&apos;re on the list!</span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, maxWidth: 350 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && email && setSubscribed(true)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 12,
                    background: 'var(--card)', border: '1px solid var(--border)',
                    color: 'var(--foreground)', fontSize: 13, outline: 'none',
                  }}
                />
                <button
                  onClick={() => email && setSubscribed(true)}
                  style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <ArrowRight size={18} style={{ color: '#fff' }} />
                </button>
              </div>
            )}
          </div>

          {/* Link Columns */}
          {[
            { title: 'Shop', links: SHOP_LINKS },
            { title: 'Support', links: SUPPORT_LINKS },
            { title: 'Company', links: COMPANY_LINKS },
          ].map(({ title, links }) => (
            <div key={title}>
              <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--foreground)', marginBottom: 20 }}>
                {title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(link => (
                  <Link key={link} href="/shop" style={{
                    fontSize: 14, color: 'var(--muted)', textDecoration: 'none',
                    fontWeight: 500, transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--foreground)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div style={{
          paddingTop: 32, borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
            © {new Date().getFullYear()} Chiangel. All rights reserved.
          </p>

          {/* Payment badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['VISA', 'MC', 'AMEX', 'PAYPAL', 'APPLE PAY'].map(badge => (
              <div key={badge} style={{
                padding: '4px 10px', borderRadius: 6,
                background: 'var(--card)', border: '1px solid var(--border)',
                fontSize: 9, fontWeight: 900, color: 'var(--muted)',
                letterSpacing: '0.05em',
              }}>
                {badge}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            {['Terms', 'Privacy', 'Cookies'].map(item => (
              <a key={item} href="#" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontWeight: 600 }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
