"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartCount,
  } = useCart();

  const [showCheckoutNotice, setShowCheckoutNotice] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-4 sm:px-8 lg:px-12 py-16 text-[#1c1a17]">
      <div className="w-full max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2d8] pb-8">
          <div>
            <Link
              href="/art-gallery"
              className="inline-flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors mb-3 group"
            >
              <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Art Gallery
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
              Shopping Cart
            </h1>
          </div>
          <span className="text-xs uppercase tracking-wider text-neutral-500 bg-[#faf8f5] border border-[#e6e2d8] px-4 py-2 rounded-full w-fit font-medium">
            {cartCount} {cartCount === 1 ? "Artwork Item" : "Artwork Items"}
          </span>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-[#faf8f5] border border-[#e6e2d8] rounded-2xl p-12 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#e8e3d8] text-neutral-400 mx-auto flex items-center justify-center">
              <ShoppingBag size={36} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
                Your Cart is Empty
              </h2>
              <p className="text-sm text-neutral-600 font-light max-w-md mx-auto leading-relaxed">
                You currently have no artworks selected. Visit our Art Gallery to view available fine art prints and digital masterworks.
              </p>
            </div>
            <Link
              href="/art-gallery"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#1c1a17] hover:bg-[#A97C5B] text-[#f5f2eb] text-xs uppercase tracking-[0.2em] font-medium rounded transition-colors duration-300 shadow-md"
            >
              <span>Explore Art Gallery</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Itemized Cart Table (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-[#faf8f5] border border-[#e6e2d8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#e6e2d8] pb-4 text-xs uppercase tracking-widest text-neutral-400 font-semibold">
                  <span>Artwork Item</span>
                  <button
                    onClick={clearCart}
                    className="flex items-center space-x-1 text-neutral-500 hover:text-red-600 transition-colors"
                  >
                    <RotateCcw size={12} />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="divide-y divide-[#e6e2d8]">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex space-x-4 items-start sm:items-center">
                        <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-neutral-200 shrink-0 border border-[#e6e2d8]">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="100px"
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#A97C5B] font-semibold">
                            {item.type} • {item.category}
                          </span>
                          <h3 className="text-base font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
                            {item.title}
                          </h3>
                          <p className="text-xs text-neutral-500 font-light">
                            {item.selectedOption}
                          </p>
                          <span className="inline-block text-xs font-serif font-bold text-[#1c1a17] sm:hidden pt-1">
                            ${item.price.toLocaleString()} each
                          </span>
                        </div>
                      </div>

                      {/* Right: Quantity, Item Total & Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e6e2d8]/60">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3 border border-[#d8d3c5] rounded-md bg-[#f5f2eb] px-2.5 py-1">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="text-neutral-500 hover:text-black p-0.5"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-semibold text-[#1c1a17] w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="text-neutral-500 hover:text-black p-0.5"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <span className="text-base font-serif font-bold text-[#1c1a17]">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        {/* Remove Icon */}
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-2"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Collector Guarantee Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600">
                <div className="p-4 bg-[#faf8f5] border border-[#e6e2d8] rounded-xl flex items-start space-x-3">
                  <ShieldCheck size={20} className="text-[#A97C5B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
                      Authenticity Certificate
                    </h4>
                    <p className="font-light text-neutral-500 text-[11px] mt-0.5">
                      Hand-signed studio seal & embossed edition certificate included with every artwork.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#faf8f5] border border-[#e6e2d8] rounded-xl flex items-start space-x-3">
                  <Truck size={20} className="text-[#A97C5B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
                      Archival Packaging
                    </h4>
                    <p className="font-light text-neutral-500 text-[11px] mt-0.5">
                      Shipped in protective wooden gallery tubes with full insurance coverage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#faf8f5] border border-[#e6e2d8] rounded-2xl p-6 space-y-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-serif font-semibold text-[#1c1a17] uppercase tracking-wider border-b border-[#e6e2d8] pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Artwork Subtotal</span>
                    <span className="font-serif font-semibold text-[#1c1a17] text-sm">
                      ${cartSubtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Packaging & Insurance</span>
                    <span className="text-emerald-700 font-medium uppercase tracking-wider text-[11px]">
                      Complimentary
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Estimated Shipping</span>
                    <span className="text-neutral-400 italic">Calculated at checkout</span>
                  </div>

                  <div className="pt-4 border-t border-[#e6e2d8] flex justify-between items-baseline">
                    <span className="text-sm font-semibold uppercase tracking-wider text-[#1c1a17]">
                      Total Price
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#1c1a17]">
                      ${cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setShowCheckoutNotice(true)}
                    className="w-full py-4 bg-[#1c1a17] hover:bg-[#A97C5B] text-[#f5f2eb] text-xs uppercase tracking-[0.2em] font-medium rounded transition-colors duration-300 flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={14} />
                  </button>

                  <Link
                    href="/art-gallery"
                    className="block text-center w-full py-3 border border-[#1c1a17] text-[#1c1a17] hover:bg-[#1c1a17] hover:text-[#f5f2eb] text-[11px] uppercase tracking-[0.2em] font-medium rounded transition-all duration-300"
                  >
                    Continue Browsing Gallery
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Checkout Notice Modal */}
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
                <Sparkles size={24} />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A97C5B] font-semibold">
                  Phase 1 Frontend Preview
                </span>
                <h3 className="text-xl font-serif font-semibold text-[#1c1a17] uppercase tracking-wider">
                  Checkout System Ready for Integration
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  Payment processing, custom shipping rates, and customer ordering backend will be connected in Phase 2. Your selected items ({cartCount} items, total ${cartSubtotal.toLocaleString()}) are preserved in your local cart.
                </p>
              </div>
              <button
                onClick={() => setShowCheckoutNotice(false)}
                className="w-full py-3 bg-[#1c1a17] text-[#f5f2eb] hover:bg-[#A97C5B] text-xs uppercase tracking-[0.2em] font-medium rounded transition-colors duration-300"
              >
                Back to Cart
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
