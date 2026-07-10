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
        setStatus("error");
      }
    } else {
      // Simulation mode for UI demo when keys are not defined
      setTimeout(() => {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-2xl bg-[#faf8f5] border border-[#e6e2d8] shadow-lg">
      <h2 className="text-xl uppercase tracking-[0.2em] text-[#1c1a17] font-light mb-8 font-serif">
        Send a Message
      </h2>

      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-3"
        >
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>Your message was sent successfully! We will reach out shortly.</span>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center space-x-3"
        >
          <AlertCircle size={18} className="text-rose-600" />
          <span>Failed to send the message. Please try again later.</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
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
            className={`w-full px-4 py-3 bg-white border rounded-lg text-sm text-[#1c1a17] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#1c1a17] transition-colors duration-300 ${
              errors.name ? "border-rose-400 focus:ring-rose-500" : "border-[#e6e2d8]"
            }`}
          />
          {errors.name && <span className="text-[11px] text-rose-600">{errors.name}</span>}
        </div>

        {/* Email Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
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
            className={`w-full px-4 py-3 bg-white border rounded-lg text-sm text-[#1c1a17] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#1c1a17] transition-colors duration-300 ${
              errors.email ? "border-rose-400 focus:ring-rose-500" : "border-[#e6e2d8]"
            }`}
          />
          {errors.email && <span className="text-[11px] text-rose-600">{errors.email}</span>}
        </div>

        {/* Phone Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="phone" className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
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
            className={`w-full px-4 py-3 bg-white border rounded-lg text-sm text-[#1c1a17] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#1c1a17] transition-colors duration-300 ${
              errors.phone ? "border-rose-400 focus:ring-rose-500" : "border-[#e6e2d8]"
            }`}
          />
          {errors.phone && <span className="text-[11px] text-rose-600">{errors.phone}</span>}
        </div>

        {/* Message Field */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="message" className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project or inquiry..."
            disabled={status === "loading"}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-sm text-[#1c1a17] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#1c1a17] transition-colors duration-300 resize-none ${
              errors.message ? "border-rose-400 focus:ring-rose-500" : "border-[#e6e2d8]"
            }`}
          />
          {errors.message && <span className="text-[11px] text-rose-600">{errors.message}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-[#1c1a17] hover:bg-[#2d2b28] text-[#f5f2eb] font-semibold rounded-lg text-sm transition-all duration-300 uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{status === "loading" ? "Sending..." : "Submit Inquiry"}</span>
          {status !== "loading" && <Send size={14} />}
        </button>
      </form>
    </div>
  );
}
