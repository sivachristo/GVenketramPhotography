"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowRight, ShieldCheck } from "lucide-react";
import { fadeIn } from "@/utils/animations";

export default function WorkshopHero({ data, onRegisterClick, onDetailsClick }) {
  return (
    <div className="relative w-full overflow-hidden bg-[#1c1a17] text-[#f5f2eb] py-20 lg:py-28 px-4 sm:px-8 lg:px-12">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity transform scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${data.heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a17] via-[#1c1a17]/80 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-4xl space-y-6">
          
          {/* Badge & Seat Counter */}
          <motion.div 
            initial="hidden" 
            animate="show" 
            variants={fadeIn("down", 0.1)}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] bg-[#A97C5B] text-white shadow-lg">
              <ShieldCheck size={14} />
              {data.badge}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider bg-[#332f2b] text-[#d8d3c5] border border-[#443e39]">
              <Users size={14} className="text-[#A97C5B]" />
              Only {data.availableSeats} of {data.totalSeats} Seats Remaining
            </span>
          </motion.div>

          {/* Main Title & Tagline */}
          <motion.div 
            initial="hidden" 
            animate="show" 
            variants={fadeIn("up", 0.2)}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-widest font-serif leading-tight">
              {data.title.split("&")[0]} &amp; <br className="hidden sm:inline" />
              <span className="font-serif italic font-semibold text-[#A97C5B]">
                {data.title.split("&")[1] || "Light"}
              </span>
            </h1>
            <p className="text-lg sm:text-2xl font-serif italic text-neutral-300 font-light max-w-3xl">
              {data.subtitle}
            </p>
          </motion.div>

          {/* Short Intro Description */}
          <motion.p 
            initial="hidden" 
            animate="show" 
            variants={fadeIn("up", 0.3)}
            className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light max-w-2xl"
          >
            {data.description.split("\n\n")[0]}
          </motion.p>

          {/* Key Quick Info Grid */}
          <motion.div 
            initial="hidden" 
            animate="show" 
            variants={fadeIn("up", 0.4)}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 pb-2 border-y border-[#332f2b]"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded bg-[#2b2723] text-[#A97C5B] mt-0.5">
                <Calendar size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">Date &amp; Schedule</span>
                <span className="text-xs sm:text-sm font-medium text-neutral-100">{data.date}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded bg-[#2b2723] text-[#A97C5B] mt-0.5">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">Time &amp; Duration</span>
                <span className="text-xs sm:text-sm font-medium text-neutral-100">{data.duration}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 rounded bg-[#2b2723] text-[#A97C5B] mt-0.5">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">Venue / City</span>
                <span className="text-xs sm:text-sm font-medium text-neutral-100">{data.venue.name}, {data.venue.city.split(" ")[0]}</span>
              </div>
            </div>
          </motion.div>

          {/* Call to Action Buttons & Fee Display */}
          <motion.div 
            initial="hidden" 
            animate="show" 
            variants={fadeIn("up", 0.5)}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4"
          >
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#f5f2eb]">
                {data.formattedFee}
              </span>
              <span className="text-xs uppercase tracking-widest text-neutral-400">
                / Participant (Inclusive of Lunch &amp; Certificate)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onRegisterClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#A97C5B] hover:bg-[#966b4c] text-white font-medium text-xs uppercase tracking-[0.2em] rounded transition-colors duration-300 shadow-xl cursor-pointer"
              >
                <span>Reserve Seat Now</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onDetailsClick}
                className="inline-flex items-center justify-center px-6 py-4 bg-transparent hover:bg-[#2b2723] text-[#d8d3c5] border border-[#443e39] font-medium text-xs uppercase tracking-[0.2em] rounded transition-colors duration-300 cursor-pointer"
              >
                Curriculum Details
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
