'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useToast } from './ToastContainer';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateQuantity, removeFromCart, totalPrice, itemCount, isLoading } = useCart();
  const { addToast } = useToast();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'var(--overlay-bg)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              height: '85vh',
              background: 'var(--drawer-bg)',
              borderTop: '1px solid var(--border)',
              borderRadius: '32px 32px 0 0',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.15)',
            }}
          >
            {/* Handle */}
            <div style={{
              width: 48, height: 6,
              background: 'var(--border)',
              borderRadius: 3,
              margin: '16px auto 8px',
            }} />

            {/* Header */}
            <div style={{
              padding: '0 24px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 24,
            }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>
                  Your Cart
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: '2px 0 0' }}>
                  {itemCount} items
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: 8,
                  background: 'var(--card)',
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >
                <X size={22} />
              </button>
            </div>

            {/* Items List */}
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: '0 24px 24px',
              display: 'flex', flexDirection: 'column', gap: 20,
              opacity: isLoading ? 0.5 : 1,
              pointerEvents: isLoading ? 'none' : 'auto',
            }}>
              {items.length === 0 ? (
                <div style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                }}>
                  <div style={{
                    width: 72, height: 72,
                    background: 'var(--card)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                    border: '1px solid var(--border)',
                  }}>
                    <ShoppingBag size={30} style={{ color: 'var(--muted)' }} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)', margin: '0 0 6px' }}>
                    Cart is empty
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 200, margin: 0 }}>
                    Looks like you haven&apos;t added anything yet.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.line_item_id} style={{ display: 'flex', gap: 16 }}>
                    {/* Thumbnail */}
                    <div style={{
                      width: 88, height: 88,
                      background: 'var(--drawer-item-bg)',
                      borderRadius: 18, overflow: 'hidden', flexShrink: 0,
                      border: '1px solid var(--border)',
                    }}>
                      {item.video_url ? (
                        <video src={item.video_url} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} muted playsInline />
                      ) : item.thumbnail_url ? (
                        <img src={item.thumbnail_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingBag size={18} style={{ color: 'var(--muted)' }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 0' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontWeight: 700, color: 'var(--foreground)', margin: 0, lineHeight: 1.3, fontSize: 14 }}>
                            {item.name}
                          </h4>
                          <button
                            onClick={() => {
                              if (item.line_item_id) {
                                removeFromCart(item.line_item_id);
                                addToast('ITEM REMOVED FROM BAG', 'info');
                              }
                            }}
                            style={{
                              background: 'none', border: 'none',
                              color: 'var(--muted)', cursor: 'pointer', padding: 2,
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {item.brand}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span style={{ fontWeight: 800, color: 'var(--foreground)', fontSize: 15 }}>
                          ${item.price.toFixed(2)}
                        </span>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          background: 'var(--drawer-item-bg)',
                          borderRadius: 12, padding: '4px 10px',
                          border: '1px solid var(--border)',
                        }}>
                          <button
                            onClick={() => {
                              if (item.line_item_id) {
                                if (item.quantity === 1) addToast('ITEM REMOVED FROM BAG', 'info');
                                updateQuantity(item.line_item_id, item.quantity - 1);
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ color: 'var(--foreground)', fontWeight: 700, minWidth: 18, textAlign: 'center', fontSize: 14 }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => item.line_item_id && updateQuantity(item.line_item_id, item.quantity + 1)}
                            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                padding: 24,
                background: 'var(--card)',
                borderTop: '1px solid var(--border)',
                borderRadius: '24px 24px 0 0',
                backdropFilter: 'blur(20px)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 14 }}>Subtotal</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--foreground)' }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  disabled={isLoading}
                  onClick={onCheckout}
                  style={{
                    width: '100%', height: 56,
                    background: 'var(--foreground)', color: 'var(--background)',
                    border: 'none', borderRadius: 18,
                    fontWeight: 800, fontSize: 16, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: isLoading ? 0.5 : 1,
                    transition: 'opacity 0.2s, transform 0.1s',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  }}
                >
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
