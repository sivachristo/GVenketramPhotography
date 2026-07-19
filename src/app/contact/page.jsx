"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { fadeIn } from "@/utils/animations";

export default function Contact() {
  const contactDetails = [
    {
      icon: <Mail size={18} />,
      label: "General Inquiries & Bookings",
      value: "info@gvenketram.com",
      href: "mailto:info@gvenketram.com",
    },
    {
      icon: <Phone size={18} />,
      label: "Studio Phone & WhatsApp",
      value: "+91 99400 69697",
      href: "https://wa.me/919940069697",
    },
    {
      icon: <MapPin size={18} />,
      label: "Main Studio Address",
      value: "284 Mercer St, Soho, New York, NY 10003",
      href: "https://maps.google.com",
    },
    {
      icon: <Clock size={18} />,
      label: "Response Times",
      value: "Mon – Fri: 09:00 AM – 06:00 PM EST",
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-4 sm:px-6 lg:px-8 py-20 text-[#1c1a17]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Panel: Text & Contact Info - 5 cols */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.1)}
            className="lg:col-span-5 space-y-10"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#1c1a17] leading-tight font-serif">
                Get In <span className="font-semibold text-[#A97C5B] font-serif italic">Touch</span>
              </h1>
            </div>

            <p className="text-sm leading-relaxed text-neutral-600 font-light">
              Whether you are planning a global advertising campaign, an editorial magazine photoshoot, or a fine art licensing request, our production team is equipped to facilitate end-to-end creative direction. Let us bring your vision to life.
            </p>

            <div className="space-y-6 pt-4 border-t border-[#e6e2d8]">
              {contactDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="p-2.5 bg-[#FAF8F5] border border-[#e6e2d8] text-[#A97C5B] rounded-lg">
                    {detail.icon}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[#A97C5B] block mb-1 font-semibold">
                      {detail.label}
                    </span>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target={detail.href.startsWith("http") ? "_blank" : undefined}
                        rel={detail.href.startsWith("http") ? "noreferrer" : undefined}
                        className="text-sm font-light text-neutral-800 hover:text-[#A97C5B] transition-all duration-300"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <span className="text-sm font-light text-neutral-800">{detail.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Panel: Contact Form - 7 cols */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("left", 0.2)}
            className="lg:col-span-7"
          >
            <ContactForm />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
