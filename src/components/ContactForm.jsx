"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.phone.trim() && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("loading");

    // WhatsApp formatting
    const whatsappNumber = "919940069697"; // 9940069697 with country code +91
    const formattedText = `*G-Venket ram website Enquiry*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Phone:* ${formData.phone || "Not provided"}\n\n` +
      `*Message:*\n${formData.message}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(formattedText)}`;
    setLastWhatsappUrl(whatsappUrl);

    // Open WhatsApp immediately in a new tab to avoid popup blockers
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // EmailJS credentials
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            reply_to: formData.email,
            phone_number: formData.phone,
            message: formData.message,
          },
          publicKey
        );
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } catch (err) {
        console.error("EmailJS Error:", err);
        // Even if EmailJS fails, the WhatsApp window was opened so we show success
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } else {
      // Simulate delay for smooth UI transition
      setTimeout(() => {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-none bg-[#faf8f5] border border-[#e6e2d8] shadow-sm">
      <h2 className="text-xl uppercase tracking-[0.2em] text-[#1c1a17] font-light mb-8 font-serif">
        Send a <span className="font-semibold text-[#A97C5B] font-serif italic">Message</span>
      </h2>

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-none text-emerald-800 text-sm flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">Message prepared! Opening WhatsApp...</span>
          </div>
          <p className="text-xs text-neutral-600 pl-7">
            If the WhatsApp tab didn't open automatically, please{" "}
            <a
              href={lastWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A97C5B] font-semibold underline hover:text-[#1c1a17]"
            >
              click here to send your message
            </a>.
          </p>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-none text-rose-800 text-sm flex items-center space-x-3"
        >
          <AlertCircle size={18} className="text-rose-600" />
          <span>Failed to send the message. Please try again later.</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-xs uppercase tracking-[0.15em] text-[#A97C5B] font-semibold">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            disabled={status === "loading"}
            className={`w-full px-0 py-2 bg-transparent border-b text-sm text-[#1c1a17] placeholder-neutral-400 focus:outline-none transition-colors duration-300 rounded-none ${errors.name ? "border-rose-400 focus:border-rose-500" : "border-[#e6e2d8] focus:border-[#A97C5B]"
              }`}
          />
          {errors.name && <span className="text-[11px] text-rose-600">{errors.name}</span>}
        </div>

        {/* Email Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-xs uppercase tracking-[0.15em] text-[#A97C5B] font-semibold">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            disabled={status === "loading"}
            className={`w-full px-0 py-2 bg-transparent border-b text-sm text-[#1c1a17] placeholder-neutral-400 focus:outline-none transition-colors duration-300 rounded-none ${errors.email ? "border-rose-400 focus:border-rose-500" : "border-[#e6e2d8] focus:border-[#A97C5B]"
              }`}
          />
          {errors.email && <span className="text-[11px] text-rose-600">{errors.email}</span>}
        </div>

        {/* Phone Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="phone" className="text-xs uppercase tracking-[0.15em] text-[#A97C5B] font-semibold">
            Phone Number (Optional)
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            disabled={status === "loading"}
            className={`w-full px-0 py-2 bg-transparent border-b text-sm text-[#1c1a17] placeholder-neutral-400 focus:outline-none transition-colors duration-300 rounded-none ${errors.phone ? "border-rose-400 focus:border-rose-500" : "border-[#e6e2d8] focus:border-[#A97C5B]"
              }`}
          />
          {errors.phone && <span className="text-[11px] text-rose-600">{errors.phone}</span>}
        </div>

        {/* Message Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="message" className="text-xs uppercase tracking-[0.15em] text-[#A97C5B] font-semibold">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project or inquiry..."
            disabled={status === "loading"}
            className={`w-full px-0 py-2 bg-transparent border-b text-sm text-[#1c1a17] placeholder-neutral-400 focus:outline-none transition-colors duration-300 resize-none rounded-none ${errors.message ? "border-rose-400 focus:border-rose-500" : "border-[#e6e2d8] focus:border-[#A97C5B]"
              }`}
          />
          {errors.message && <span className="text-[11px] text-rose-600">{errors.message}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-[#1c1a17] hover:bg-[#A97C5B] text-[#f5f2eb] font-semibold rounded-none text-sm transition-all duration-300 uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{status === "loading" ? "Sending..." : "Submit Inquiry"}</span>
          {status !== "loading" && <Send size={14} />}
        </button>
      </form>
    </div>
  );
}
