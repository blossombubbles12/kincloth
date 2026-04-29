'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle, Search, AlertCircle, Clock, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { getOrderAction } from '@/app/order-actions';
import { MainLayout } from './MainLayout';

export const TrackOrderView = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const result = await getOrderAction(orderId, email);
      if (result.success) {
        setOrder(result.order);
      } else {
        setError(result.error || 'Could not find order. Please check your details.');
      }
    } catch (err) {
      setError('An error occurred while fetching your order.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'shipped', 'delivered'];
    const current = steps.indexOf(status.toLowerCase());
    return current >= 0 ? current : 0;
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col items-center justify-start p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
              WHERE IS <br /> <span className="bg-[var(--accent)] text-black px-2">MY STUFF?</span>
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">
              Enter your details below to track your shipment.
            </p>
          </motion.div>

          <section className="neo-border bg-[var(--card)] p-8 neo-shadow mb-12">
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="orderId" className="text-xs font-black uppercase tracking-widest">Order ID / Number</label>
                  <input
                    id="orderId"
                    type="text"
                    required
                    placeholder="e.g. ord_01H..."
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full neo-input text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-black uppercase tracking-widest">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full neo-input text-lg"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full neo-button text-xl py-4 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Clock className="animate-spin" size={24} />
                ) : (
                  <Search size={24} />
                )}
                {loading ? 'LOCATING...' : 'TRACK ORDER'}
              </button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 border-2 border-red-500 bg-red-500/10 text-red-500 flex items-center gap-3 font-bold uppercase text-xs"
                >
                  <AlertCircle size={20} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <AnimatePresence>
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pb-20"
              >
                {/* Status Stepper */}
                <div className="neo-border bg-[var(--accent)] text-black p-8 neo-shadow relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-2">
                      <Truck size={28} />
                      {order.fulfillment_status.replace('_', ' ')}
                    </h2>
                    
                    <div className="flex justify-between items-center relative">
                      {/* Connector Line */}
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-black/20 -translate-y-1/2 -z-10" />
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 transition-all duration-1000 -z-10" 
                        style={{ width: `${(getStatusStep(order.fulfillment_status) / 2) * 100}%` }}
                      />

                      {['Placed', 'Shipped', 'Delivered'].map((label, idx) => {
                        const currentStep = getStatusStep(order.fulfillment_status);
                        const isCompleted = idx <= currentStep;
                        return (
                          <div key={label} className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 border-4 border-black flex items-center justify-center bg-white ${isCompleted ? 'bg-black text-[var(--accent)]' : 'text-black'}`}>
                              {isCompleted ? <CheckCircle size={20} /> : <div className="w-2 h-2 bg-black" />}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Items */}
                  <div className="neo-border bg-[var(--card)] p-6 neo-shadow">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b-2 border-[var(--border)] pb-2 flex items-center gap-2">
                      <Package size={16} />
                      Order Items
                    </h3>
                    <div className="space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 items-center border-b border-[var(--border)] border-dashed pb-4 last:border-0">
                          <div className="w-16 h-16 neo-border flex-shrink-0 overflow-hidden bg-white">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-black uppercase truncate">{item.title}</div>
                            <div className="text-[10px] font-bold text-[var(--muted)]">QTY: {item.quantity}</div>
                          </div>
                          <div className="text-xs font-black">
                            ${(item.unit_price / 100).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Payment Info */}
                  <div className="space-y-8">
                    <div className="neo-border bg-[var(--card)] p-6 neo-shadow">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-[var(--border)] pb-2 flex items-center gap-2">
                        <MapPin size={16} />
                        Shipping To
                      </h3>
                      <div className="text-xs font-bold uppercase leading-relaxed">
                        {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
                        {order.shipping_address.address_1}<br />
                        {order.shipping_address.city}, {order.shipping_address.province_code} {order.shipping_address.postal_code}<br />
                        {order.shipping_address.country_code?.toUpperCase()}
                      </div>
                    </div>

                    <div className="neo-border bg-[var(--card)] p-6 neo-shadow">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-[var(--border)] pb-2 flex items-center gap-2">
                        <CreditCard size={16} />
                        Order Summary
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span>SUBTOTAL</span>
                          <span>${(order.summary.subtotal / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold">
                          <span>SHIPPING</span>
                          <span>${(order.summary.shipping_total / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black border-t-2 border-[var(--border)] pt-2 mt-2">
                          <span>TOTAL</span>
                          <span>${(order.summary.total / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed bottom-0 right-0 p-12 -z-10 opacity-10 pointer-events-none select-none">
        <Package size={400} className="rotate-12" />
      </div>
    </MainLayout>
  );
};
