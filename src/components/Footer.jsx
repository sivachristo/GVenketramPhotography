import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#d8d3c5] bg-[#E2DDD3] text-neutral-500 py-12 mt-auto">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4 sm:px-8 lg:px-12">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[#1c1a17]">
            <span className="font-serif font-semibold">G-VENKETRAM</span> <span className="font-sans font-light text-[9px] text-neutral-500">PHOTOGRAPHY</span>
          </p>
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} G-Venketram Photography. All rights reserved.
          </p>
        </div>

        {/* Middle Links */}
        <div className="flex space-x-6 text-xs uppercase tracking-widest text-neutral-400">
          <Link href="/about" className="hover:text-black transition-colors duration-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-black transition-colors duration-300">
            Contact
          </Link>
          <Link href="/" className="hover:text-black transition-colors duration-300">
            Portfolio
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-end space-y-3">
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors duration-300 text-neutral-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors duration-300 text-neutral-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px]"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors duration-300 text-neutral-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
          <p className="text-[10px] text-neutral-400 flex items-center gap-1">
            Made with <Heart size={10} className="fill-neutral-400 text-neutral-400" /> for premium visual storytelling.
          </p>
        </div>
      </div>
    </footer>
  );
}
