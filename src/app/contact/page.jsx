"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { fadeIn } from "@/utils/animations";

export default function Contact() {
  const contactDetails = [
    {
      icon: <Mail className="text-neutral-500" size={20} />,
      label: "General Inquiries & Bookings",
      value: "info@gvenketram.com",
      href: "mailto:info@gvenketram.com",
    },
    {
      icon: <Phone className="text-neutral-500" size={20} />,
      label: "Studio Production Line",
      value: "+1 (555) 019-2834",
      href: "tel:+15550192834",
    },
    {
      icon: <MapPin className="text-neutral-500" size={20} />,
      label: "Main Studio Address",
      value: "284 Mercer St, Soho, New York, NY 10003",
      href: "https://maps.google.com",
    },
    {
      icon: <Clock className="text-neutral-500" size={20} />,
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
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold mb-2 block">
                Let's Collaborate
              </span>
              <h1 className="text-4xl sm:text-5xl font-light uppercase tracking-widest text-[#1c1a17] leading-tight font-serif">
                Get In <span className="font-semibold text-neutral-500 font-serif">Touch</span>
              </h1>
            </div>

            <p className="text-sm leading-relaxed text-neutral-600 font-light">
              Whether you are planning a global advertising campaign, an editorial magazine photoshoot, or a fine art licensing request, our production team is equipped to facilitate end-to-end creative direction. Let us bring your vision to life.
            </p>

            <div className="space-y-6 pt-4 border-t border-[#e6e2d8]">
              {contactDetails.map((detail, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="p-2 bg-white border border-[#e6e2d8] rounded-lg shadow-sm">
                    {detail.icon}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block mb-1 font-semibold">
                      {detail.label}
                    </span>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target={detail.href.startsWith("http") ? "_blank" : undefined}
                        rel={detail.href.startsWith("http") ? "noreferrer" : undefined}
                        className="text-sm font-light text-neutral-800 hover:text-black hover:font-normal transition-all duration-300"
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
