"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { fadeIn } from "@/utils/animations";

export default function ContactContent({ initialData }) {
  const data = initialData || {};

  const titlePrefix = data.titlePrefix || "";
  const titleHighlight = data.titleHighlight || "";
  const description = data.description || "";

  const email = data.email || "";
  const phone = data.phone || "";
  const whatsappNumber = data.whatsappNumber || "";
  const address = data.address || "";
  const addressMapUrl = data.addressMapUrl || "";
  const workingHours = data.workingHours || "";

  // Build contact details array — only include items that have a value
  const contactDetails = [];

  if (email.trim()) {
    contactDetails.push({
      icon: <Mail size={18} />,
      label: "General Inquiries & Bookings",
      value: email,
      href: `mailto:${email}`,
    });
  }

  if (phone.trim()) {
    contactDetails.push({
      icon: <Phone size={18} />,
      label: "Studio Phone & WhatsApp",
      value: phone,
      href: whatsappNumber.trim()
        ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`
        : `tel:${phone}`,
    });
  }

  if (address.trim()) {
    contactDetails.push({
      icon: <MapPin size={18} />,
      label: "Main Studio Address",
      value: address,
      href: addressMapUrl.trim() || null,
    });
  }

  if (workingHours.trim()) {
    contactDetails.push({
      icon: <Clock size={18} />,
      label: "Response Times",
      value: workingHours,
      href: null,
    });
  }

  const hasTitle = titlePrefix.trim() || titleHighlight.trim();
  const hasDescription = description.trim();
  const hasContactDetails = contactDetails.length > 0;
  const hasLeftPanel = hasTitle || hasDescription || hasContactDetails;

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-4 sm:px-6 lg:px-8 py-20 text-[#1c1a17]">
      <div className="mx-auto max-w-7xl">
        <div className={`grid grid-cols-1 ${hasLeftPanel ? "lg:grid-cols-12" : ""} gap-16 items-start`}>
          
          {/* Left Panel: Text & Contact Info - 5 cols (only if there's content) */}
          {hasLeftPanel && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeIn("up", 0.1)}
              className="lg:col-span-5 space-y-10"
            >
              {hasTitle && (
                <div>
                  <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-widest text-[#1c1a17] leading-tight font-serif">
                    {titlePrefix}{titlePrefix && titleHighlight ? " " : ""}
                    {titleHighlight && (
                      <span className="font-semibold text-[#A97C5B] font-serif italic">
                        {titleHighlight}
                      </span>
                    )}
                  </h1>
                </div>
              )}

              {hasDescription && (
                <p className="text-sm leading-relaxed text-neutral-600 font-light whitespace-pre-line">
                  {description}
                </p>
              )}

              {hasContactDetails && (
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
              )}
            </motion.div>
          )}

          {/* Right Panel: Contact Form - expands to full width if no left panel */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("left", 0.2)}
            className={hasLeftPanel ? "lg:col-span-7" : "lg:col-span-12 max-w-2xl mx-auto w-full"}
          >
            <ContactForm
              whatsappNumber={whatsappNumber}
              formTitle={data.formTitle}
              formHighlight={data.formHighlight}
            />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
