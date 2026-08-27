"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, ChevronRight } from "lucide-react";
import { fadeIn } from "@/utils/animations";

export default function WorkshopSchedule({ schedule }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const activeDay = schedule[activeDayIndex];

  return (
    <section id="schedule" className="py-20 px-4 sm:px-8 lg:px-12 bg-[#faf8f5] border-b border-[#d8d3c5]">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold block">
            Curriculum &amp; Timeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light uppercase tracking-wider text-[#1c1a17]">
            Workshop <span className="font-semibold text-[#A97C5B] italic font-serif">Schedule</span>
          </h2>
          <p className="text-sm text-neutral-600 font-light">
            A carefully structured 14-hour physical itinerary balancing foundational theory, live shooting sessions, and post-production.
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex justify-center border-b border-[#d8d3c5] gap-4 sm:gap-8">
          {schedule.map((dayData, idx) => {
            const isActive = activeDayIndex === idx;
            return (
              <button
                key={dayData.day}
                onClick={() => setActiveDayIndex(idx)}
                className={`pb-4 px-4 font-serif text-base sm:text-lg transition-colors duration-300 relative cursor-pointer ${
                  isActive
                    ? "text-[#1c1a17] font-semibold"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className={isActive ? "text-[#A97C5B]" : "text-neutral-400"} />
                  <span>{dayData.day} &ndash; {dayData.dateLabel}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="scheduleDayIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#A97C5B]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Timeline Header Subtitle */}
        <div className="bg-[#E2DDD3]/50 p-6 rounded-lg border border-[#d8d3c5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A97C5B] block">
              {activeDay.day} Focus Area
            </span>
            <h3 className="text-xl font-serif font-semibold text-[#1c1a17]">
              {activeDay.title}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f2eb] border border-[#d8d3c5] rounded text-xs font-medium text-neutral-600">
            <Clock size={14} className="text-[#A97C5B]" />
            10:00 AM &ndash; 05:00 PM IST
          </span>
        </div>

        {/* Visual Timeline Nodes */}
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#d8d3c5]">
          {activeDay.sessions.map((session, sIdx) => {
            const isBreak = session.number.toLowerCase().includes("break");

            return (
              <motion.div
                key={session.number + sIdx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeIn("up", sIdx * 0.08)}
                className="relative group"
              >
                {/* Node Bullet */}
                <div 
                  className={`absolute -left-6 sm:-left-10 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isBreak
                      ? "bg-[#faf8f5] border-neutral-400 text-neutral-500"
                      : "bg-[#f5f2eb] border-[#A97C5B] text-[#A97C5B] group-hover:bg-[#A97C5B] group-hover:text-white"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isBreak ? "bg-neutral-400" : "bg-current"}`} />
                </div>

                {/* Session Card */}
                <div 
                  className={`p-6 sm:p-8 rounded-lg border transition-all duration-300 ${
                    isBreak
                      ? "bg-[#E2DDD3]/30 border-dashed border-[#d8d3c5]"
                      : "bg-[#E2DDD3]/70 border-[#d8d3c5] hover:border-[#A97C5B] shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded ${
                        isBreak 
                          ? "bg-neutral-300 text-neutral-700" 
                          : "bg-[#A97C5B] text-white"
                      }`}>
                        {session.number}
                      </span>
                      <h4 className="text-lg sm:text-xl font-serif font-semibold text-[#1c1a17]">
                        {session.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1 text-xs font-semibold text-[#A97C5B] bg-[#f5f2eb] px-3 py-1 rounded border border-[#d8d3c5] w-fit">
                      <Clock size={13} />
                      <span>{session.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 font-light leading-relaxed">
                    {session.desc}
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
