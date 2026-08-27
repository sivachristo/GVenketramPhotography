"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Camera, UserCheck, MapPin, AlertCircle, Sparkles } from "lucide-react";
import { fadeIn } from "@/utils/animations";

export default function WorkshopDetails({ data }) {
  return (
    <section id="details" className="py-20 px-4 sm:px-8 lg:px-12 bg-[#f5f2eb] border-b border-[#d8d3c5]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section 1: Detailed About & Studio Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            variants={fadeIn("right", 0.1)}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold block">
              In-Depth Exploration
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light uppercase tracking-wider text-[#1c1a17]">
              About The <span className="font-semibold text-[#A97C5B] italic font-serif">Masterclass</span>
            </h2>

            <div className="space-y-4 text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
              <p>
                Lighting is not merely technical illumination; it is the emotional vocabulary of a photograph. In this 2-day physical workshop, G. Venket Ram demystifies the exact light setups, continuous cine lights, and modifier combinations he uses for high-fashion magazine covers and celebrity campaigns.
              </p>
              <p>
                Unlike generic online tutorials, you will be inside a professional studio environment operating high-end studio generators, directing live professional talent, and testing shadow placement in real-time with instant tethered feedback.
              </p>
            </div>

            <div className="p-6 bg-[#faf8f5] border-l-4 border-[#A97C5B] rounded-r-lg shadow-sm">
              <p className="font-serif italic text-base sm:text-lg text-neutral-800">
                &ldquo;Mastering light gives you the freedom to create atmosphere on demand—whether in a dark studio or under harsh midday sun.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true }}
            variants={fadeIn("left", 0.2)}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-lg overflow-hidden border border-[#d8d3c5] shadow-xl aspect-[4/3]">
              <img
                src={data.studioImage}
                alt="G Venket Ram Photography Studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a17]/80 via-transparent to-transparent flex items-end p-6">
                <p className="text-white text-xs font-serif italic">
                  G. Venket Ram Photography Studios &ndash; Nungambakkam, Chennai
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Section 2: Who Can Attend & What to Bring (Two Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Who Can Attend */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("up", 0.1)}
            className="p-8 rounded-lg bg-[#E2DDD3]/50 border border-[#d8d3c5] space-y-6"
          >
            <div className="flex items-center space-x-3 text-[#1c1a17]">
              <div className="p-2.5 rounded bg-[#faf8f5] text-[#A97C5B] border border-[#d8d3c5]">
                <UserCheck size={22} />
              </div>
              <h3 className="text-2xl font-serif font-semibold">Who Can Attend</h3>
            </div>

            <ul className="space-y-4">
              {data.whoCanAttend.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-neutral-700 font-light">
                  <CheckCircle2 size={18} className="text-[#A97C5B] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* What Participants Should Bring */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("up", 0.2)}
            className="p-8 rounded-lg bg-[#E2DDD3]/50 border border-[#d8d3c5] space-y-6"
          >
            <div className="flex items-center space-x-3 text-[#1c1a17]">
              <div className="p-2.5 rounded bg-[#faf8f5] text-[#A97C5B] border border-[#d8d3c5]">
                <Camera size={22} />
              </div>
              <h3 className="text-2xl font-serif font-semibold">What You Should Bring</h3>
            </div>

            <ul className="space-y-4">
              {data.whatToBring.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-neutral-700 font-light">
                  <CheckCircle2 size={18} className="text-[#A97C5B] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Section 3: Venue Information & Important Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Venue Details */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("up", 0.1)}
            className="lg:col-span-7 p-8 rounded-lg bg-[#faf8f5] border border-[#d8d3c5] space-y-6"
          >
            <div className="flex items-center space-x-3 text-[#1c1a17]">
              <div className="p-2.5 rounded bg-[#E2DDD3] text-[#A97C5B]">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-semibold">Venue Information</h3>
                <p className="text-xs uppercase tracking-widest text-[#A97C5B] font-medium">Physical Location</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-neutral-700">
              <p className="font-semibold text-base text-[#1c1a17]">{data.venue.name}</p>
              <p className="font-light">{data.venue.address}</p>
              <p className="font-light">{data.venue.city}</p>
              <p className="text-xs text-neutral-500 font-medium italic mt-1">Landmark: {data.venue.landmark}</p>
            </div>

            <p className="text-xs text-neutral-600 font-light leading-relaxed border-t border-[#d8d3c5] pt-4">
              {data.venueInfo.description}
            </p>

            {/* Venue Amenities */}
            <div className="space-y-2 pt-2">
              <span className="text-xs uppercase font-semibold text-[#1c1a17] tracking-wider block">Studio Amenities Included:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.venueInfo.amenities.map((amenity, aIdx) => (
                  <div key={aIdx} className="flex items-center space-x-2 text-xs text-neutral-600">
                    <Sparkles size={13} className="text-[#A97C5B]" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Important Instructions */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn("up", 0.2)}
            className="lg:col-span-5 p-8 rounded-lg bg-[#332f2b] text-[#f5f2eb] border border-[#443e39] space-y-6"
          >
            <div className="flex items-center space-x-3 text-white">
              <div className="p-2.5 rounded bg-[#2b2723] text-[#A97C5B] border border-[#443e39]">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-2xl font-serif font-semibold">Important Instructions</h3>
            </div>

            <ul className="space-y-4">
              {data.importantInstructions.map((instruction, iIdx) => (
                <li key={iIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  <span className="text-[#A97C5B] font-bold text-sm font-serif">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
