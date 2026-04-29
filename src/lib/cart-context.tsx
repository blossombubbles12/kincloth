'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from './types';
import { 
  createCart, 
  getCart, 
  addToCartMedusa, 
  updateLineItemMedusa, 
  deleteLineItemMedusa 
} from '@/app/cart-actions';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variantId?: string) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  cartId: string | null;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const syncCart = (cart: any) => {
    if (!cart) {
      // Load from local storage if cart sync fails
      const savedItems = localStorage.getItem('local_cart_items');
      if (savedItems) {
        try {
          setItems(JSON.parse(savedItems));
        } catch (e) {
          console.error('Failed to parse local cart items', e);
        }
      }
      return;
    }
    
    const mappedItems: CartItem[] = (cart.items || []).map((item: any) => ({
      id: item.product_id,
      variant_id: item.variant_id,
      line_item_id: item.id,
      name: item.title,
      price: (item.unit_price || 0) / 100,
      quantity: item.quantity,
      video_url: item.metadata?.video_url || '',
      thumbnail_url: item.thumbnail,
    }));
    
    setItems(mappedItems);
    setCartId(cart.id);
    localStorage.setItem('cart_id', cart.id);
    localStorage.removeItem('local_cart_items'); // Clear local fallback if sync is successful
  };

  useEffect(() => {
    const initCart = async () => {
      const savedCartId = localStorage.getItem('cart_id');
      if (savedCartId) {
        const cart = await getCart(savedCartId);
        if (cart) {
          syncCart(cart);
        } else {
          const newCart = await createCart();
          syncCart(newCart);
        }
      } else {
        const newCart = await createCart();
        syncCart(newCart);
      }
      setIsLoading(false);
    };
    initCart();
  }, []);

  const addToCart = async (product: Product, variantId?: string) => {
    setIsLoading(true);
    const targetVariantId = variantId || product.variant_id;
    
    let cart = null;
    if (cartId) {
      cart = await addToCartMedusa(cartId, targetVariantId, 1);
    }
    
    if (cart) {
      syncCart(cart);
    } else {
      // Fallback: Update local state
      setItems(prev => {
        const existing = prev.find(i => i.variant_id === targetVariantId);
        let updated;
        if (existing) {
          updated = prev.map(i => i.variant_id === targetVariantId ? { ...i, quantity: i.quantity + 1 } : i);
        } else {
          updated = [...prev, { ...product, variant_id: targetVariantId, line_item_id: `local_${Date.now()}`, quantity: 1 }];
        }
        localStorage.setItem('local_cart_items', JSON.stringify(updated));
        return updated;
      });
    }
    setIsLoading(false);
    setIsCartOpen(true);
  };

  const removeFromCart = async (lineItemId: string) => {
    setIsLoading(true);
    let success = false;
    if (cartId && !lineItemId.startsWith('local_')) {
      const updatedCart = await deleteLineItemMedusa(cartId, lineItemId);
      if (updatedCart) {
        syncCart(updatedCart);
        success = true;
      }
    }
    
    if (!success) {
      setItems(prev => {
        const updated = prev.filter(i => i.line_item_id !== lineItemId);
        localStorage.setItem('local_cart_items', JSON.stringify(updated));
        return updated;
      });
    }
    setIsLoading(false);
  };

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    if (quantity < 0) return;
    setIsLoading(true);
    
    let success = false;
    if (cartId && !lineItemId.startsWith('local_')) {
      let updatedCart;
      if (quantity === 0) {
        updatedCart = await deleteLineItemMedusa(cartId, lineItemId);
      } else {
        updatedCart = await updateLineItemMedusa(cartId, lineItemId, quantity);
      }
      
      if (updatedCart) {
        syncCart(updatedCart);
        success = true;
      }
    }
    
    if (!success) {
      setItems(prev => {
        const updated = prev.map(i => i.line_item_id === lineItemId ? { ...i, quantity } : i).filter(i => i.quantity > 0);
        localStorage.setItem('local_cart_items', JSON.stringify(updated));
        return updated;
      });
    }
    setIsLoading(false);
  };

  const clearCart = () => {
    setItems([]);
    setCartId(null);
    localStorage.removeItem('cart_id');
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      totalPrice,
      isLoading,
      cartId,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
