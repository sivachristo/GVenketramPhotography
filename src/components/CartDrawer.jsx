"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount,
    toastMessage,
  } = useCart();

  const [showCheckoutNotice, setShowCheckoutNotice] = useState(false);

  const handleCheckoutClick = () => {
    setShowCheckoutNotice(true);
  };

  return (
    <>
      {/* Instant Toast Notification Floating at Top Right */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 right-4 sm:right-8 z-50 flex items-center space-x-3 bg-[#1c1a17] text-[#f5f2eb] px-5 py-3.5 rounded-lg shadow-2xl border border-neutral-700 max-w-md"
          >
            <CheckCircle2 size={18} className="text-[#A97C5B] shrink-0" />
            <span className="text-xs uppercase tracking-wider font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-[#1c1a17]/50 backdrop-blur-xs"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#f5f2eb] border-l border-[#d8d3c5] shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#e6e2d8]">
                <div className="flex items-center space-x-3">
                  <ShoppingBag size={20} className="text-[#A97C5B]" />
                  <h2 className="text-lg font-serif uppercase tracking-widest text-[#1c1a17] font-semibold">
                    Your Artwork Cart
                  </h2>
                  <span className="text-xs font-sans text-neutral-500 bg-[#e8e3d8] px-2 py-0.5 rounded-full font-medium">
                    {cartCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-neutral-500 hover:text-black transition-colors rounded-full hover:bg-[#e8e3d8]"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body - Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <div className="w-16 h-16 rounded-full bg-[#e8e3d8] flex items-center justify-center text-neutral-400">
                      <ShoppingBag size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-serif uppercase tracking-wider text-[#1c1a17] font-semibold">
                        Your Cart is Empty
                      </h3>
                      <p className="text-xs text-neutral-500 font-light max-w-xs leading-relaxed">
                        Discover limited edition fine art prints and digital gallery masterworks.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] bg-[#1c1a17] text-[#f5f2eb] px-6 py-3 rounded hover:bg-[#A97C5B] transition-colors duration-300 font-medium"
                    >
                      <span>Browse Art Gallery</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex space-x-4 p-3 bg-[#faf8f5] border border-[#e6e2d8] rounded-lg relative group"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative w-20 h-24 rounded overflow-hidden shrink-0 bg-neutral-200">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Info & Quantity */}
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1c1a17] font-serif pr-2 line-clamp-1">
                              {item.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <span className="inline-block text-[9px] uppercase tracking-widest text-[#A97C5B] font-semibold mt-0.5">
                            {item.type} • {item.category}
                          </span>
                          <p className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5 font-light">
                            {item.selectedOption}
                          </p>
                        </div>

                        {/* Controls & Price */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e6e2d8]/60">
                          {/* Quantity Selector */}
                          <div className="flex items-center space-x-2 border border-[#d8d3c5] rounded bg-[#f5f2eb] px-1.5 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="text-neutral-500 hover:text-black p-0.5"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-semibold text-[#1c1a17] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-neutral-500 hover:text-black p-0.5"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Item Price */}
                          <span className="text-xs font-serif font-semibold text-[#1c1a17]">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-[#e6e2d8] bg-[#faf8f5] space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs uppercase tracking-wider text-neutral-500">
                      <span>Subtotal</span>
                      <span className="text-sm font-serif font-semibold text-[#1c1a17]">
                        ${cartSubtotal.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-light">
                      Shipping and taxes will be calculated during final checkout.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-3.5 bg-[#1c1a17] hover:bg-[#A97C5B] text-[#f5f2eb] text-xs uppercase tracking-[0.2em] font-medium rounded transition-colors duration-300 flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={14} />
                    </button>

                    <Link
                      href="/art-gallery/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="block text-center w-full py-2.5 border border-[#1c1a17] text-[#1c1a17] hover:bg-[#1c1a17] hover:text-[#f5f2eb] text-[11px] uppercase tracking-[0.2em] font-medium rounded transition-all duration-300"
                    >
                      View Full Cart ({cartCount})
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Notice Modal (Phase 2 Preview) */}
      <AnimatePresence>
        {showCheckoutNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutNotice(false)}
              className="absolute inset-0 bg-[#1c1a17]/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl p-6 shadow-2xl space-y-5 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#A97C5B]/15 text-[#A97C5B] mx-auto flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A97C5B] font-semibold">
                  Phase 1 Frontend Preview
                </span>
                <h3 className="text-xl font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
                  Checkout Coming Soon
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  Thank you for exploring the G Venket Ram Art Gallery. Payment gateway integration, shipping calculations, and order fulfillment will be active in the upcoming development release.
                </p>
                <div className="p-3 bg-[#faf8f5] border border-[#e6e2d8] rounded text-left text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-[#1c1a17]">
                    <span>Items in Cart:</span>
                    <span>{cartCount}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#1c1a17]">
                    <span>Subtotal Saved:</span>
                    <span>${cartSubtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCheckoutNotice(false)}
                className="w-full py-3 bg-[#1c1a17] text-[#f5f2eb] hover:bg-[#A97C5B] text-xs uppercase tracking-[0.2em] font-medium rounded transition-colors duration-300"
              >
                Continue Browsing
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
