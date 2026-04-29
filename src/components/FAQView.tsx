'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from './MainLayout';

const FAQ_DATA = [
  {
    category: 'ORDERS & SHIPPING',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International shipping varies by location but typically takes 7-14 days.'
      },
      {
        q: 'Can I change my order after it is placed?',
        a: 'Once an order is placed, we process it immediately. You have a 30-minute window to contact support for any changes. After that, we cannot guarantee modifications.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to over 50 countries. Shipping costs and delivery times will be calculated at checkout based on your location.'
      }
    ]
  },
  {
    category: 'RETURNS & EXCHANGES',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy for all unworn and unwashed items with original tags attached. Returns are free for domestic orders.'
      },
      {
        q: 'How do I start an exchange?',
        a: 'To start an exchange, visit our returns portal, enter your order ID and email, and select the "Exchange" option. We will ship your new item once the original is received.'
      }
    ]
  },
  {
    category: 'PRODUCT & SIZING',
    questions: [
      {
        q: 'How do I know my size?',
        a: 'Each product page has a detailed size guide. Our items generally follow a standard streetwear fit (slightly oversized). If you are between sizes, we recommend sizing down for a more tailored look.'
      },
      {
        q: 'How should I wash my Kincloth items?',
        a: 'To preserve the quality and prints, we recommend washing inside out in cold water and hanging to dry. Avoid using bleach or high-heat tumble drying.'
      }
    ]
  },
  {
    category: 'PAYMENTS',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay. We also offer "Buy Now, Pay Later" via Klarna and Afterpay.'
      }
    ]
  }
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b-2 border-[var(--border)] last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group hover:bg-[var(--accent)] hover:text-black transition-colors px-4"
      >
        <span className="text-lg md:text-xl font-black uppercase tracking-tight">{question}</span>
        <div className={`neo-border p-1 ${isOpen ? 'bg-black text-[var(--accent)]' : 'bg-white text-black'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[var(--card)]"
          >
            <div className="p-6 text-sm md:text-base font-bold leading-relaxed text-[var(--muted)] border-t-2 border-[var(--border)] border-dashed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQView = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            GOT <span className="bg-[var(--accent)] text-black px-2 inline-block -rotate-1">QUESTIONS?</span>
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] max-w-xl mx-auto">
            Everything you need to know about our drops, shipping, and more. If you can&apos;t find it here, hit us up.
          </p>
        </motion.div>

        <div className="space-y-12 mb-20">
          {FAQ_DATA.map((section) => (
            <section key={section.category} className="neo-border bg-[var(--card)] neo-shadow">
              <div className="bg-black text-[var(--accent)] p-4 border-b-2 border-black">
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">{section.category}</h2>
              </div>
              <div>
                {section.questions.map((item, idx) => (
                  <AccordionItem
                    key={item.q}
                    question={item.q}
                    answer={item.a}
                    isOpen={openIndex === `${section.category}-${idx}`}
                    onClick={() => toggle(`${section.category}-${idx}`)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Support Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: <MessageCircle />, title: 'LIVE CHAT', desc: 'Available 24/7' },
            { icon: <Mail />, title: 'EMAIL US', desc: 'support@kincloth.com' },
            { icon: <Phone />, title: 'CALL US', desc: '+1 (800) KIN-CLOTH' },
          ].map((item) => (
            <div key={item.title} className="neo-border p-6 bg-[var(--card)] neo-shadow-hover text-center space-y-3 cursor-pointer">
              <div className="w-12 h-12 neo-border bg-[var(--accent)] text-black flex items-center justify-center mx-auto">
                {item.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">{item.title}</h3>
              <p className="text-xs font-bold text-[var(--muted)]">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>

      {/* Decorative Help Icon */}
      <div className="fixed bottom-0 left-0 p-12 -z-10 opacity-10 pointer-events-none select-none">
        <HelpCircle size={400} className="-rotate-12" />
      </div>
    </MainLayout>
  );
};
