"use client";

import { motion } from "framer-motion";
import { Sun, Users, Palette, Award, UserCheck, FileCheck } from "lucide-react";
import { fadeIn } from "@/utils/animations";

const iconMap = {
  Sun: Sun,
  Users: Users,
  Palette: Palette,
  Award: Award,
  UserCheck: UserCheck,
  FileCheck: FileCheck,
};

export default function WorkshopHighlights({ highlights }) {
  return (
    <section className="py-20 px-4 sm:px-8 lg:px-12 bg-[#f5f2eb] border-b border-[#d8d3c5]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold block">
            Why Attend This Offline Masterclass
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light uppercase tracking-wider text-[#1c1a17]">
            Workshop <span className="font-semibold text-[#A97C5B] italic font-serif">Highlights</span>
          </h2>
          <p className="text-sm text-neutral-600 font-light">
            Designed to transform theoretical light concepts into instinctual, high-end practical execution.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || Sun;
            return (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn("up", idx * 0.1)}
                className="p-8 rounded-lg bg-[#E2DDD3]/60 border border-[#d8d3c5] hover:border-[#A97C5B] transition-all duration-300 group hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded bg-[#f5f2eb] border border-[#d8d3c5] flex items-center justify-center text-[#A97C5B] group-hover:bg-[#A97C5B] group-hover:text-white transition-colors duration-300">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#1c1a17]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
