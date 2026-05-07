'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { CheckoutSheet } from './CheckoutSheet';
import { useCart } from '@/lib/cart-context';
import { SearchProvider } from '@/lib/search-context';
import { Product } from '@/lib/types';
import { MobileNav } from './MobileNav';

interface MainLayoutProps {
  children: React.ReactNode;
  products?: Product[];
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideMobileNav?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  products = [],
  hideHeader = false,
  hideFooter = false,
  hideMobileNav = false
}) => {
  const { isCartOpen, setIsCartOpen } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <SearchProvider products={products}>
      <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {!hideHeader && <Header />}
      
      <main className="flex-1">
        {children}
        {!hideFooter && <Footer />}
      </main>

      {/* Global Drawers */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />
      <CheckoutSheet 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
      {!hideMobileNav && <MobileNav />}
      </div>
    </SearchProvider>
  );
};
