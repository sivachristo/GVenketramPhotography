"use client";

import { motion } from "framer-motion";
import { Award, Camera, Check } from "lucide-react";
import { fadeIn } from "@/utils/animations";

export default function WorkshopInstructor({ instructor }) {
  return (
    <section className="py-20 px-4 sm:px-8 lg:px-12 bg-[#E2DDD3]/40 border-b border-[#d8d3c5]">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#faf8f5] rounded-xl border border-[#d8d3c5] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Instructor Portrait Image */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("right", 0.1)}
            className="lg:col-span-4 relative flex justify-center"
          >
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-lg overflow-hidden border-2 border-[#A97C5B] shadow-xl">
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a17]/90 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#A97C5B] font-semibold">Lead Instructor</span>
                <span className="text-lg font-serif font-bold">{instructor.name}</span>
              </div>
            </div>
          </motion.div>

          {/* Instructor Bio & Achievements */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("left", 0.2)}
            className="lg:col-span-8 space-y-6"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold block mb-1">
                Meet Your Mentor
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#1c1a17]">
                {instructor.name}
              </h2>
              <p className="text-sm font-medium text-neutral-500 tracking-wider uppercase mt-1">
                {instructor.title} &ndash; {instructor.experience}
              </p>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              {instructor.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-[#d8d3c5] py-4">
              <div className="flex items-center space-x-3 text-xs sm:text-sm text-neutral-700 font-medium">
                <div className="p-2 rounded bg-[#E2DDD3] text-[#A97C5B]">
                  <Award size={16} />
                </div>
                <span>Iconic Celebrity &amp; Calendar Campaigns</span>
              </div>
              <div className="flex items-center space-x-3 text-xs sm:text-sm text-neutral-700 font-medium">
                <div className="p-2 rounded bg-[#E2DDD3] text-[#A97C5B]">
                  <Camera size={16} />
                </div>
                <span>Over 2,000 High-Fashion Shoots</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs font-serif italic text-neutral-500">
                &ldquo;Every photographer must learn to read shadow as deeply as light.&rdquo;
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
