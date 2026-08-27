"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Printer, Calendar, MapPin, Clock, Ticket, User, Mail, Phone, Download, ArrowRight, RotateCcw } from "lucide-react";
import { fadeIn } from "@/utils/animations";

export default function WorkshopTicketConfirmation({ data, paymentData, onReset }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-12 bg-[#f5f2eb] min-h-screen text-[#1c1a17]">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Success Header Message */}
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={fadeIn("down", 0.1)}
          className="text-center space-y-4 print:hidden"
        >
          <div className="w-16 h-16 bg-[#A97C5B] text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold block">
            Seat Reserved &amp; Confirmed
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light uppercase tracking-wider text-[#1c1a17]">
            Registration <span className="font-semibold text-[#A97C5B] italic font-serif">Confirmed</span>
          </h1>
          <p className="text-sm text-neutral-600 font-light max-w-xl mx-auto">
            Thank you, <span className="font-semibold text-[#1c1a17]">{paymentData?.fullName}</span>! Your seat for the offline photography masterclass has been reserved. Please keep this ticket confirmation pass ready upon arrival at the studio.
          </p>
        </motion.div>

        {/* PRINTABLE TICKET PASS CONTAINER */}
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={fadeIn("up", 0.2)}
          className="bg-[#faf8f5] rounded-2xl border-2 border-[#1c1a17] shadow-2xl overflow-hidden print:border print:shadow-none print:m-0"
        >
          
          {/* Ticket Header Banner */}
          <div className="bg-[#1c1a17] text-[#f5f2eb] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#A97C5B]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#A97C5B] font-semibold block">
                Official Masterclass Pass
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-wider">
                G. VENKET RAM <span className="font-light italic text-[#A97C5B]">STUDIOS</span>
              </h2>
            </div>
            
            <div className="bg-[#2b2723] px-4 py-2 rounded border border-[#443e39] text-right">
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 block font-medium">
                Unique Registration Token
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-[#A97C5B]">
                {paymentData?.tokenNumber || "WRK-2026-00125"}
              </span>
            </div>
          </div>

          {/* Ticket Body Grid */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Event & Participant Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-[#d8d3c5] pb-6">
              
              <div className="md:col-span-7 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">Workshop Title</span>
                <h3 className="text-xl font-serif font-bold text-[#1c1a17]">{data.title}</h3>
                <p className="text-xs text-neutral-600 font-light">{data.subtitle}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-[#A97C5B] text-white">
                  {data.badge}
                </span>
              </div>

              <div className="md:col-span-5 bg-[#E2DDD3]/50 p-4 rounded-lg border border-[#d8d3c5] space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#A97C5B] font-semibold block">Registered Attendee</span>
                <div className="space-y-1 text-xs text-neutral-800">
                  <p className="font-bold text-sm text-[#1c1a17] flex items-center gap-1.5">
                    <User size={14} className="text-[#A97C5B]" />
                    {paymentData?.fullName}
                  </p>
                  <p className="flex items-center gap-1.5 font-light text-neutral-600">
                    <Mail size={13} className="text-neutral-400" />
                    {paymentData?.email}
                  </p>
                  <p className="flex items-center gap-1.5 font-light text-neutral-600">
                    <Phone size={13} className="text-neutral-400" />
                    {paymentData?.phone}
                  </p>
                  <p className="text-[11px] font-medium text-neutral-500 pt-1">
                    Seats Reserved: <span className="font-bold text-[#1c1a17]">{paymentData?.participantCount || 1} Person(s)</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Date, Time, Venue Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-[#d8d3c5] pb-6">
              
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded bg-[#E2DDD3] text-[#A97C5B] shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">Date</span>
                  <span className="text-xs sm:text-sm font-bold text-[#1c1a17]">{data.date}</span>
                  <span className="text-[11px] text-neutral-500 block">Sat &amp; Sun</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded bg-[#E2DDD3] text-[#A97C5B] shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">Timing &amp; Hours</span>
                  <span className="text-xs sm:text-sm font-bold text-[#1c1a17]">{data.time}</span>
                  <span className="text-[11px] text-neutral-500 block">Doors open 09:30 AM</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded bg-[#E2DDD3] text-[#A97C5B] shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">Venue Address</span>
                  <span className="text-xs sm:text-sm font-bold text-[#1c1a17]">{data.venue.name}</span>
                  <span className="text-[11px] text-neutral-500 block">{data.venue.city}</span>
                </div>
              </div>

            </div>

            {/* Payment Status & Instructions Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-7 space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">Important Attendance Note</span>
                <p className="text-xs text-neutral-700 font-light leading-relaxed">
                  Please present this digital pass or a printed copy along with a valid photo ID upon arrival. Studio doors open at 09:30 AM IST for morning coffee and orientation.
                </p>
              </div>

              <div className="md:col-span-5 bg-[#E2DDD3]/30 p-4 rounded border border-dashed border-[#d8d3c5] text-right space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">Payment Status</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 border border-green-300 text-green-800 rounded font-semibold text-xs">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span>{paymentData?.paymentStatus || "SUCCESSFUL"} (MOCK)</span>
                </div>
                <p className="text-[10px] text-neutral-500">
                  Total Paid: <span className="font-bold text-neutral-800">₹{(paymentData?.paidAmount || data.fee).toLocaleString("en-IN")}</span>
                </p>
              </div>

            </div>

            {/* Simulated Barcode / QR Visual Stub */}
            <div className="pt-4 border-t border-[#d8d3c5] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="space-y-1">
                <span className="font-mono text-xs text-neutral-400 font-bold uppercase tracking-widest block">
                  |||||| ||| ||||||| |||| |||||| ||| ||||
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  TOKEN: {paymentData?.tokenNumber} &bull; ISSUED BY G VENKET RAM PHOTOGRAPHY
                </span>
              </div>

              <span className="text-[10px] uppercase font-semibold tracking-widest text-[#A97C5B] bg-[#f5f2eb] px-3 py-1.5 rounded border border-[#d8d3c5]">
                Offline Studio Pass &bull; Verified
              </span>
            </div>

          </div>

        </motion.div>

        {/* Action Buttons (Print & Navigation) */}
        <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#A97C5B] hover:bg-[#966b4c] text-white font-medium text-xs uppercase tracking-[0.2em] rounded transition-colors duration-300 shadow-lg cursor-pointer"
          >
            <Printer size={18} />
            <span>Download / Print Confirmation Pass</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-transparent hover:bg-[#E2DDD3] text-neutral-800 border border-[#d8d3c5] font-medium text-xs uppercase tracking-[0.2em] rounded transition-colors duration-300 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Reserve Another Seat</span>
          </button>
        </div>

      </div>
    </div>
  );
}
