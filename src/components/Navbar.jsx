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

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#d8d3c5] bg-[#E2DDD3]">
        <div className="relative w-full flex h-16 items-center justify-center px-4 sm:px-8 lg:px-12">
          
          {/* Logo / Brand - Absolute Left Alignment */}
          <div className="absolute left-4 sm:left-6 lg:left-8">
            <Link 
              href="/" 
              className="group flex items-baseline text-[#1c1a17] uppercase"
            >
              <span className="font-serif text-sm sm:text-base font-semibold tracking-[0.12em] text-neutral-800 group-hover:text-black transition-colors duration-300">G-VENKETRAM</span>
              <span className="ml-1.5 font-sans text-[8px] sm:text-[9px] tracking-[0.2em] text-neutral-500 group-hover:text-black transition-colors duration-300 font-light hidden sm:inline">PHOTOGRAPHY</span>
            </Link>
          </div>

          {/* Desktop Nav Links - Dead Center in Viewport */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:text-black ${
                    isActive ? "text-black font-semibold" : "text-neutral-500 font-medium"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Socials / Mobile Menu Button - Absolute Right Alignment */}
          <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center space-x-4">
            {/* Desktop Socials */}
            <div className="hidden md:flex items-center space-x-4 text-neutral-500">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center p-2 text-neutral-500 hover:text-black md:hidden transition-colors duration-300"
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
