"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
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
    ? "ml-1.5 font-sans text-[8px] sm:text-[9px] tracking-[0.2em] text-[#F8F5F1]/70 group-hover:text-white transition-colors duration-300 font-light hidden sm:inline"
    : "ml-1.5 font-sans text-[8px] sm:text-[9px] tracking-[0.2em] text-neutral-500 group-hover:text-black transition-colors duration-300 font-light hidden sm:inline";

  const socialsClass = isHome 
    ? "hidden md:flex items-center space-x-4 text-[#F8F5F1]/75"
    : "hidden md:flex items-center space-x-4 text-neutral-500";
    
  const socialLinkHoverClass = isHome
    ? "hover:text-white transition-colors duration-300"
    : "hover:text-black transition-colors duration-300";

  const mobileMenuButtonClass = isHome
    ? "flex items-center justify-center p-2 text-[#F8F5F1]/85 hover:text-white md:hidden transition-colors duration-300"
    : "flex items-center justify-center p-2 text-neutral-500 hover:text-black md:hidden transition-colors duration-300";

  const getNavLinkClass = (linkHref) => {
    const isActive = pathname === linkHref;
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
              <span className={logoTextClass}>G-VENKETRAM</span>
              <span className={logoSubTextClass}>PHOTOGRAPHY</span>
            </Link>
          </div>

          {/* Desktop Nav Links - Dead Center in Viewport */}
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

          {/* Desktop Socials / Mobile Menu Button - Absolute Right Alignment */}
          <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center space-x-4">
            {/* Desktop Socials */}
            <div className={socialsClass}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={socialLinkHoverClass}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className={socialLinkHoverClass}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={socialLinkHoverClass}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className={mobileMenuButtonClass}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>


        </div>
      </header>

      {/* Sidebar for Mobile */}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} navLinks={navLinks} />
    </>
  );
}
