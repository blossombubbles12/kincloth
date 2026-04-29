'use client';

import React from 'react';
import { Send, Phone, MapPin, Mail } from 'lucide-react';
import { MainLayout } from './MainLayout';

export function ContactPageView() {
  return (
    <MainLayout>
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-12 lg:mb-20">
          <h1 className="text-5xl lg:text-8xl font-black uppercase tracking-tight leading-none mb-4">
            Holla <br /> At Us
          </h1>
          <p className="text-lg lg:text-xl font-bold uppercase tracking-widest text-[var(--muted)] max-w-2xl">
            Got a question? Need a refund? Or just want to talk trash? Drop a line. We read everything.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Form */}
          <div className="neo-border bg-[var(--card)] p-6 lg:p-10">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b-2 border-[var(--border)] pb-4">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest">Name</label>
                <input type="text" className="w-full neo-input" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest">Email</label>
                <input type="email" className="w-full neo-input" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest">Order Number (Optional)</label>
                <input type="text" className="w-full neo-input" placeholder="#KIN-12345" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest">Message</label>
                <textarea className="w-full neo-input min-h-[150px] resize-y" placeholder="What's up?"></textarea>
              </div>
              <button className="w-full neo-button py-4 text-base flex items-center justify-center gap-2">
                SEND TRANSMISSION <Send size={18} />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div className="neo-border bg-[var(--background)] p-8 flex items-start gap-6 neo-shadow-hover">
              <div className="w-12 h-12 neo-border bg-[var(--accent)] text-black flex items-center justify-center flex-shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase mb-2">Email</h3>
                <p className="text-[var(--muted)] font-medium mb-1">General: info@kincloth.com</p>
                <p className="text-[var(--muted)] font-medium">Support: help@kincloth.com</p>
              </div>
            </div>

            <div className="neo-border bg-[var(--background)] p-8 flex items-start gap-6 neo-shadow-hover">
              <div className="w-12 h-12 neo-border bg-[var(--accent)] text-black flex items-center justify-center flex-shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase mb-2">Phone</h3>
                <p className="text-[var(--muted)] font-medium mb-1">+1 (800) 123-4567</p>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mt-2">Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>

            <div className="neo-border bg-[var(--background)] p-8 flex items-start gap-6 neo-shadow-hover">
              <div className="w-12 h-12 neo-border bg-[var(--accent)] text-black flex items-center justify-center flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase mb-2">HQ</h3>
                <p className="text-[var(--muted)] font-medium mb-1">123 Streetwear Ave, Suite 400</p>
                <p className="text-[var(--muted)] font-medium">New York, NY 10012</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
