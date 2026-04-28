'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {mounted && createPortal(
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '12px',
          pointerEvents: 'none', width: '100%', maxWidth: '420px', padding: '0 24px',
        }}>
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -50, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: -30 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '12px', padding: '16px 20px', borderRadius: '20px', border: '3px solid #000',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
                  backgroundColor: toast.type === 'success' ? '#10b981' : toast.type === 'info' ? '#f43f5e' : '#ffffff',
                  color: '#000000',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {toast.type === 'success' ? (
                    <CheckCircle2 size={22} strokeWidth={3} />
                  ) : toast.type === 'info' ? (
                    <Info size={22} strokeWidth={3} />
                  ) : (
                    <AlertCircle size={22} strokeWidth={3} />
                  )}
                  <span style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
                    {toast.message}
                  </span>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
