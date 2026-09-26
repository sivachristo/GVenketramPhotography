"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "gvenketram_art_cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage when updated
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [cartItems, isLoaded]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (artwork, selectedOption = null, quantity = 1) => {
    const optionObj = selectedOption || (artwork.options ? artwork.options[0] : null);
    const itemPrice = optionObj?.price || artwork.price;
    const optionLabel = optionObj?.label || artwork.type;
    const cartItemId = `${artwork.id}_${optionObj?.id || "default"}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            id: artwork.id,
            title: artwork.title,
            image: artwork.image,
            price: itemPrice,
            type: artwork.type,
            category: artwork.category,
            selectedOption: optionLabel,
            optionId: optionObj?.id || null,
            quantity: quantity,
          },
        ];
      }
    });

    showToast(`Added "${artwork.title}" to your cart.`);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Client-side display total. Note: When integrating checkout/payment gateways,
  // price MUST be re-verified server-side from Supabase/DB by artwork ID to prevent price tampering.
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        cartCount,
        cartSubtotal,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
