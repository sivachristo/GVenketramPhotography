"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Mail, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ isOpen, onClose, navLinks }) {
  const pathname = usePathname();

  const sidebarVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 35,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 35,
      },
    },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#1c1a17]/30 backdrop-blur-sm md:hidden"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm bg-[#E2DDD3] p-6 border-l border-[#d8d3c5] shadow-2xl flex flex-col justify-between md:hidden"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <span className="font-serif text-sm font-semibold tracking-[0.1em] text-[#1c1a17] uppercase flex items-baseline">
                  G-VENKETRAM<span className="ml-1 font-sans text-[8px] font-light tracking-widest text-neutral-400">PHOTO</span>
                </span>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-500 hover:text-black transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`text-lg uppercase tracking-[0.25em] transition-colors hover:text-black ${
                          isActive ? "text-black font-semibold" : "text-neutral-500"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Contact & Social Details */}
            <div className="border-t border-[#d8d3c5] pt-8 mt-auto space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-neutral-500">
                  <Mail size={16} className="text-neutral-400" />
                  <span>info@gvenketram.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-500">
                  <Phone size={16} className="text-neutral-400" />
                  <span>+1 (555) 019-2834</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-neutral-500">
                  <MapPin size={16} className="text-neutral-400" />
                  <span>New York, NY</span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center space-x-4 text-neutral-500">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
