'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check, CreditCard, Truck, User, ArrowLeft, ShoppingBag, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { 
  updateCartMedusa, 
  getShippingOptions, 
  addShippingMethod, 
  createPaymentSessions, 
  completeCart 
} from '@/app/cart-actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartId, clearCart, totalPrice, items } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    postal_code: '',
    country_code: 'gb',
  });

  const handleNext = async () => {
    if (!cartId) return;
    setIsLoading(true);

    try {
      if (step === 1) {
        await updateCartMedusa(cartId, {
          email: formData.email,
          shipping_address: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            address_1: formData.address_1,
            city: formData.city,
            postal_code: formData.postal_code,
            country_code: formData.country_code,
          }
        });
        const options = await getShippingOptions(cartId);
        setShippingOptions(options || []);
        setStep(2);
      } else if (step === 2) {
        if (!selectedOption) return;
        await addShippingMethod(cartId, selectedOption);
        await createPaymentSessions(cartId);
        setStep(3);
      } else if (step === 3) {
        const result = await completeCart(cartId);
        if (result.type === 'order') {
          setStep(4);
          setTimeout(() => {
            clearCart();
            router.push('/shop');
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full h-14 bg-[var(--input-bg)] border-[2px] border-[var(--border)] px-4 text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none focus:bg-[var(--accent)] focus:text-black transition-all font-bold";

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col lg:flex-row">
      {/* ── LEFT SIDE: Main Checkout Flow ── */}
      <div className="flex-1 p-6 sm:p-10 lg:p-16 max-w-4xl mx-auto w-full">
        <header className="flex items-center justify-between mb-12">
          <Link href="/shop" className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Shop</span>
          </Link>
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`w-8 h-8 flex items-center justify-center border-2 border-[var(--border)] font-black text-xs transition-colors ${
                  step === s ? 'bg-[var(--accent)] text-black' : step > s ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--card-muted)] text-[var(--muted)]'
                }`}
              >
                {step > s ? <Check size={14} strokeWidth={3} /> : s}
              </div>
            ))}
          </div>
        </header>

        <main className="max-w-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Shipping</h1>
                  <p className="text-[var(--muted)] text-sm font-bold uppercase tracking-widest">Where should we send your gear?</p>
                </div>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. human@kincloth.com"
                      className={inputStyle}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ml-1">First Name</label>
                      <input 
                        placeholder="John"
                        className={inputStyle}
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ml-1">Last Name</label>
                      <input 
                        placeholder="Doe"
                        className={inputStyle}
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ml-1">Delivery Address</label>
                    <input 
                      placeholder="Street, Apartment, Suite"
                      className={inputStyle}
                      value={formData.address_1}
                      onChange={(e) => setFormData({...formData, address_1: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ml-1">City</label>
                      <input 
                        placeholder="Lagos"
                        className={inputStyle}
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block ml-1">Postal Code</label>
                      <input 
                        placeholder="101233"
                        className={inputStyle}
                        value={formData.postal_code}
                        onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Delivery</h1>
                  <p className="text-[var(--muted)] text-sm font-bold uppercase tracking-widest">Select your preferred speed</p>
                </div>

                <div className="space-y-4">
                  {shippingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`w-full p-8 border-[3px] text-left transition-all group ${
                        selectedOption === opt.id 
                        ? 'bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)]' 
                        : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black uppercase tracking-tight text-xl">
                          {opt.name}
                        </span>
                        <span className="font-black text-xl">
                          ${(opt.amount / 100).toFixed(2)}
                        </span>
                      </div>
                      <p className={`text-xs font-bold uppercase tracking-widest ${selectedOption === opt.id ? 'opacity-70' : 'text-[var(--muted)]'}`}>
                        {opt.data?.description || 'Standard secure delivery'}
                      </p>
                    </button>
                  ))}
                  {shippingOptions.length === 0 && (
                    <div className="p-10 border-[3px] border-dashed border-[var(--border)] text-center">
                      <p className="text-[var(--muted)] font-bold uppercase tracking-widest text-xs">No shipping options available for this region</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Payment</h1>
                  <p className="text-[var(--muted)] text-sm font-bold uppercase tracking-widest">Secure your limited drop</p>
                </div>

                <div className="p-10 border-[3px] border-[var(--border)] bg-[var(--card-muted)] text-center space-y-6">
                  <div className="w-20 h-20 bg-[var(--accent)] border-[3px] border-black flex items-center justify-center mx-auto neo-shadow transform -rotate-3">
                    <Lock size={32} className="text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest mb-1">Total Amount Due</p>
                    <p className="text-5xl font-black">${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">
                    <ShieldCheck size={14} /> 
                    <span>End-to-End Encrypted Transaction</span>
                  </div>
                </div>

                <p className="text-[10px] text-[var(--muted)] font-bold uppercase leading-relaxed text-center px-10">
                  By completing this order, you agree to our terms of service and recognize that this is a simulated transaction for platform demonstration purposes.
                </p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 py-20"
              >
                <div className="w-32 h-32 bg-[var(--accent)] border-[3px] border-black flex items-center justify-center mx-auto neo-shadow rotate-12">
                  <Check className="text-black" size={64} strokeWidth={4} />
                </div>
                <div>
                  <h1 className="text-5xl font-black uppercase tracking-tight mb-4 leading-none">Order Confirmed</h1>
                  <p className="text-[var(--muted)] font-black uppercase tracking-[0.2em] text-sm">Welcome to the inner circle.</p>
                </div>
                <div className="inline-block px-6 py-3 border-[3px] border-[var(--border)] bg-[var(--card-muted)] font-bold text-xs uppercase tracking-widest">
                  Redirecting to shop...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 4 && (
            <div className="mt-12">
              <button
                onClick={handleNext}
                disabled={isLoading || (step === 2 && !selectedOption)}
                className="w-full h-20 bg-[var(--btn-bg)] text-[var(--btn-text)] border-[3px] border-[var(--border)] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 neo-shadow group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-6 h-6 border-[3px] border-t-transparent border-[var(--btn-text)] rounded-full"
                    />
                    Processing
                  </span>
                ) : (
                  <>
                    {step === 3 ? 'Confirm Order' : 'Continue'}
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ── RIGHT SIDE: Order Summary (Sticky on Desktop) ── */}
      <aside className="w-full lg:w-[450px] bg-[var(--card-muted)] border-l-[3px] border-[var(--border)] p-6 sm:p-10 lg:p-16">
        <div className="sticky top-16">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 pb-4 border-b-2 border-[var(--border)] flex items-center justify-between">
            Summary
            <span className="text-xs font-bold text-[var(--muted)]">{items.length} Items</span>
          </h2>

          <div className="space-y-6 mb-12 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-24 bg-[var(--card)] border-2 border-[var(--border)] flex-shrink-0 overflow-hidden">
                  <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-black uppercase text-sm leading-none mb-1">{item.name}</h3>
                    <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t-2 border-[var(--border)] pt-8">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              <span>Shipping</span>
              <span>{selectedOption ? 'Calculated' : 'TBD'}</span>
            </div>
            <div className="flex justify-between text-2xl font-black uppercase tracking-tighter pt-4 border-t border-[var(--border)] border-dashed">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-12 p-6 border-2 border-black bg-[var(--accent)] text-black neo-shadow-sm rotate-1">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={20} strokeWidth={3} />
              <p className="text-xs font-black uppercase tracking-widest">Premium Guarantee</p>
            </div>
            <p className="text-[10px] font-bold leading-relaxed opacity-80">
              Each piece is inspected for quality and authenticity before being secured for transit.
            </p>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); }
      `}</style>
    </div>
  );
}
