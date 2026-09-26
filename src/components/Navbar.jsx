"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, LogOut, Sliders } from "lucide-react";
import Sidebar from "./Sidebar";
import AdminSettingsModal from "@/components/admin/AdminSettingsModal";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount, toggleCart } = useCart();
  const { isArtGalleryEnabled, isWorkshopEnabled } = useSettings();

  const navLinks = [
    { name: "Home", href: "/" },
    ...(isArtGalleryEnabled ? [{ name: "Art Gallery", href: "/art-gallery" }] : []),
    ...(isWorkshopEnabled ? [{ name: "Workshop", href: "/workshop" }] : []),
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isHome = pathname === "/";

  const headerClass = isHome 
    ? "absolute top-0 z-40 w-full border-b border-transparent bg-transparent" 
    : "sticky top-0 z-40 w-full border-b border-[#d8d3c5] bg-[#E2DDD3]";
    
  const logoTextClass = isHome
    ? "font-serif text-sm sm:text-base font-semibold tracking-[0.12em] text-[#F8F5F1] group-hover:text-white transition-colors duration-300"
    : "font-serif text-sm sm:text-base font-semibold tracking-[0.12em] text-neutral-800 group-hover:text-black transition-colors duration-300";

  const logoSubTextClass = isHome
    ? "ml-1.5 font-sans text-[7.5px] sm:text-[9px] tracking-[0.25em] text-[#F8F5F1]/80 group-hover:text-white transition-colors duration-300 font-light inline"
    : "ml-1.5 font-sans text-[7.5px] sm:text-[9px] tracking-[0.25em] text-neutral-500 group-hover:text-black transition-colors duration-300 font-light inline";

  const socialsClass = isHome 
    ? "hidden md:flex items-center space-x-4 text-[#F8F5F1]/75"
    : "hidden md:flex items-center space-x-4 text-neutral-500";
    
  const socialLinkHoverClass = isHome
    ? "hover:text-white transition-colors duration-300"
    : "hover:text-black transition-colors duration-300";

  const mobileMenuButtonClass = isHome
    ? "flex items-center justify-center p-2 text-[#F8F5F1]/85 hover:text-white md:hidden transition-colors duration-300 cursor-pointer"
    : "flex items-center justify-center p-2 text-neutral-500 hover:text-black md:hidden transition-colors duration-300 cursor-pointer";

  const cartButtonClass = isHome
    ? "relative flex items-center justify-center p-2 text-[#F8F5F1]/85 hover:text-white transition-colors duration-300 cursor-pointer"
    : "relative flex items-center justify-center p-2 text-neutral-600 hover:text-black transition-colors duration-300 cursor-pointer";

  const getNavLinkClass = (linkHref) => {
    const isActive = pathname === linkHref || (linkHref !== "/" && pathname.startsWith(linkHref));
    if (isHome) {
      return `text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:text-white ${
        isActive ? "text-white font-semibold text-shadow-editorial" : "text-[#F8F5F1]/75 font-medium"
      }`;
    } else {
      return `text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:text-black ${
        isActive ? "text-black font-semibold" : "text-neutral-500 font-medium"
      }`;
    }
  };

  const isAdmin = pathname?.toLowerCase().startsWith("/admin");

  return (
    <>
      <header className={headerClass}>
        <div className="relative w-full flex h-16 items-center justify-center px-4 sm:px-8 lg:px-12">
          
          {/* Logo / Brand - Absolute Left Alignment */}
          <div className="absolute left-4 sm:left-6 lg:left-8">
            <Link 
              href="/" 
              className="group flex items-baseline uppercase"
            >
              <span className={logoTextClass}>G VENKET RAM</span>
              <span className={logoSubTextClass}>PHOTOGRAPHY</span>
            </Link>
          </div>

          {/* Desktop Nav Links - Dead Center in Viewport (Hidden on Admin) */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={getNavLinkClass(link.href)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Socials, Cart Button / Mobile Menu Button - Absolute Right Alignment */}
          {!isAdmin ? (
            <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center space-x-3 sm:space-x-4">
              {/* Desktop Socials */}
              <div className={socialsClass}>
                <a href="https://www.instagram.com/venketramg/?hl=en" target="_blank" rel="noreferrer" className={socialLinkHoverClass} title="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://x.com/venketramg?lang=en" target="_blank" rel="noreferrer" className={socialLinkHoverClass} title="X (Twitter)">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.facebook.com/p/GVenket-Ram-Photography-100044462768229/" target="_blank" rel="noreferrer" className={socialLinkHoverClass} title="Facebook">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>

              {/* Shopping Cart Button (Shown only when Art Gallery module is enabled) */}
              {isArtGalleryEnabled && (
                <button
                  onClick={toggleCart}
                  className={cartButtonClass}
                  aria-label="Shopping Cart"
                  title="View Artwork Cart"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#A97C5B] text-[9px] font-bold text-white shadow">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(true)}
                className={mobileMenuButtonClass}
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            </div>
          ) : (
            <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center space-x-4">
              {/* Settings Button Next to Sign Out */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-600 hover:text-black font-semibold transition-colors cursor-pointer px-2.5 py-1 rounded hover:bg-neutral-200/50"
                title="Site Settings & Visibility"
              >
                <Sliders size={14} />
                <span>Settings</span>
              </button>

              <div className="h-4 w-px bg-[#d8d3c5]" />

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    sessionStorage.removeItem("gvr_admin_auth");
                    window.location.reload();
                  }
                }}
                className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-600 hover:text-red-700 font-semibold transition-colors cursor-pointer px-2.5 py-1 rounded hover:bg-red-100/50"
                title="Sign Out of Admin"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}

        </div>
      </header>

      {/* Admin Settings Modal */}
      {isAdmin && (
        <AdminSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Sidebar for Mobile */}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} navLinks={navLinks} />
    </>
  );
}
