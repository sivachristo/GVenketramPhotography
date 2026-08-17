"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeIn } from "@/utils/animations";

export default function HeroScrollLink() {
  const handleScroll = (e) => {
    e.preventDefault();
    const element = document.getElementById("portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeIn("up", 0.3)}
    >
      <Link
        href="#portfolio"
        onClick={handleScroll}
        className="inline-flex flex-col items-center gap-2 text-xs uppercase tracking-[0.4em] text-[#F8F5F1] hover:text-white transition-colors duration-300 font-medium group text-shadow-editorial"
      >
        <span>View Portfolio</span>
        <span className="text-sm transform group-hover:translate-y-1 transition-transform duration-300 font-sans">↓</span>
      </Link>
    </motion.div>
  );
}
