import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = {
  id: string;           // unique per line (e.g., slug + timestamp)
  name: string;
  price: number;        // base price
  qty: number;
  // Optional metadata from your detail screen:
  flavors?: string[];
  modifiers?: string[];
  notes?: string;
  imageUrl?: string;    // optional thumbnail
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;

  // Mini-cart popup UI
  isMiniOpen: boolean;
  openMini: () => void;
  closeMini: () => void;
  toggleMini: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMiniOpen, setIsMiniOpen] = useState(false);

  const addItem: CartContextValue['addItem'] = (item) => {
    const id = item.id ?? `${item.name}-${Date.now()}`;
    setItems((prev) => [...prev, { ...item, id }]);
    // Auto-open mini cart when adding
    setIsMiniOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter(i => i.id !== id));

  const updateQty = (id: string, qty: number) => {
    setItems((prev) => prev.map(i => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const openMini = () => setIsMiniOpen(true);
  const closeMini = () => setIsMiniOpen(false);
  const toggleMini = () => setIsMiniOpen((v) => !v);

  const value: CartContextValue = {
    items, addItem, removeItem, updateQty, clearCart, subtotal, itemCount,
    isMiniOpen, openMini, closeMini, toggleMini,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
