'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check, CreditCard, Truck, User } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { 
  updateCartMedusa, 
  getShippingOptions, 
  addShippingMethod, 
  createPaymentSessions, 
  completeCart 
} from '@/app/cart-actions';

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutSheet: React.FC<CheckoutSheetProps> = ({ isOpen, onClose }) => {
  const { cartId, clearCart, totalPrice } = useCart();
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
    country_code: 'gb', // Default to GB from seed
  });

  const handleNext = async () => {
    if (!cartId) return;
    setIsLoading(true);

    try {
      if (step === 1) {
        // Update Cart with Info & Address
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
        
        // Fetch Shipping Options
        const options = await getShippingOptions(cartId);
        setShippingOptions(options || []);
        setStep(2);
      } else if (step === 2) {
        if (!selectedOption) return;
        
        // Add Shipping Method
        await addShippingMethod(cartId, selectedOption);
        
        // Prepare Payment
        await createPaymentSessions(cartId);
        setStep(3);
      } else if (step === 3) {
        // Complete Cart
        const result = await completeCart(cartId);
        if (result.type === 'order') {
          setStep(4);
          setTimeout(() => {
            clearCart();
            onClose();
            setStep(1);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full h-14 bg-input border border-border rounded-2xl px-4 text-foreground placeholder:text-muted outline-none focus:border-accent transition-colors";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-overlay-bg backdrop-blur-md"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="relative w-full max-w-lg bg-drawer-bg border-t sm:border border-border rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-card/50">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                {step === 4 ? 'Order Confirmed!' : 'Checkout'}
              </h2>
              <button onClick={onClose} className="p-2 text-muted hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold uppercase tracking-widest mb-2">
                    <User size={16} /> Shipping Info
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className={inputStyle}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <div className="flex gap-4">
                    <input 
                      placeholder="First Name"
                      className={`${inputStyle} w-1/2`}
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    />
                    <input 
                      placeholder="Last Name"
                      className={`${inputStyle} w-1/2`}
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    />
                  </div>
                  <input 
                    placeholder="Address"
                    className={inputStyle}
                    value={formData.address_1}
                    onChange={(e) => setFormData({...formData, address_1: e.target.value})}
                  />
                  <div className="flex gap-4">
                    <input 
                      placeholder="City"
                      className={`${inputStyle} w-2/3`}
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                    <input 
                      placeholder="Zip"
                      className={`${inputStyle} w-1/3`}
                      value={formData.postal_code}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold uppercase tracking-widest mb-2">
                    <Truck size={16} /> Delivery Method
                  </div>
                  {shippingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`w-full p-6 rounded-3xl border text-left transition-all ${
                        selectedOption === opt.id 
                        ? 'bg-foreground border-foreground text-background' 
                        : 'bg-input border-border hover:border-accent'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold">
                          {opt.name}
                        </span>
                        <span className="font-bold">
                          ${(opt.amount / 100).toFixed(2)}
                        </span>
                      </div>
                      <p className={`text-xs ${selectedOption === opt.id ? 'opacity-70' : 'text-muted'}`}>
                        {opt.data?.description || 'Standard delivery time'}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 text-center py-10">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="text-emerald-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Review & Pay</h3>
                  <p className="text-muted">Your total is <span className="text-foreground font-bold">${totalPrice.toFixed(2)}</span></p>
                  <p className="text-xs text-muted-foreground px-10">By clicking complete, you agree to our terms and conditions. Payment will be processed manually for this demo.</p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 text-center py-20">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="text-background" size={48} strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-foreground">Thank You!</h3>
                  <p className="text-muted">Your order has been placed successfully.</p>
                  <p className="text-emerald-500 text-sm font-medium">Redirecting to feed...</p>
                </div>
              )}
            </div>

            {step < 4 && (
              <div className="p-6 bg-card/50 border-t border-border">
                <button
                  onClick={handleNext}
                  disabled={isLoading || (step === 2 && !selectedOption)}
                  className="w-full h-16 bg-foreground text-background rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl"
                >
                  {isLoading ? 'Processing...' : step === 3 ? 'Complete Order' : 'Continue'}
                  {!isLoading && step < 3 && <ChevronRight size={20} />}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
