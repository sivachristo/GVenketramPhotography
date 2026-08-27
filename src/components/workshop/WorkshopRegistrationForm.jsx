"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { fadeIn } from "@/utils/animations";

export default function WorkshopRegistrationForm({ data, onProceedToPayment, onBackToDetails }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cityAddress: "",
    participantCount: 1,
    cameraGearInfo: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleParticipantChange = (count) => {
    setFormData((prev) => ({ ...prev, participantCount: count }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      newErrors.phone = "Valid phone number is required";
    }
    if (!formData.cityAddress.trim()) {
      newErrors.cityAddress = "City / Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onProceedToPayment(formData);
    }
  };

  const perSeatFee = data.fee;
  const totalAmount = perSeatFee * formData.participantCount;

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-12 bg-[#f5f2eb] min-h-screen text-[#1c1a17]">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation Back Link */}
        <button
          onClick={onBackToDetails}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-neutral-600 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Masterclass Details</span>
        </button>

        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold block">
            Offline Masterclass Seat Reservation
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light uppercase tracking-wider text-[#1c1a17]">
            Workshop <span className="font-semibold text-[#A97C5B] italic font-serif">Registration</span>
          </h1>
          <p className="text-sm text-neutral-600 font-light">
            Fill in your participant details below to reserve your seat for the offline photography workshop in Chennai.
          </p>
        </div>

        {/* Workshop Summary Card */}
        <div className="bg-[#E2DDD3] p-6 rounded-lg border border-[#d8d3c5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A97C5B] font-semibold">Selected Event</span>
            <h3 className="text-lg font-serif font-semibold text-[#1c1a17]">{data.title}</h3>
            <p className="text-xs text-neutral-600">{data.dateFormatted} &bull; {data.venue.name}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-500 uppercase tracking-wider block">Fee per Participant</span>
            <span className="text-xl font-serif font-bold text-[#1c1a17]">{data.formattedFee}</span>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-[#faf8f5] p-8 sm:p-10 rounded-xl border border-[#d8d3c5] shadow-sm space-y-8">
          
          {/* Section 1: Participant Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-semibold text-[#1c1a17] border-b border-[#d8d3c5] pb-3">
              1. Participant Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-xs uppercase tracking-wider font-semibold text-neutral-700 flex items-center gap-1.5">
                  <User size={14} className="text-[#A97C5B]" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ananya Sharma"
                  className={`w-full px-4 py-3 rounded bg-[#f5f2eb] border text-sm focus:outline-none transition-colors ${
                    errors.fullName ? "border-red-500" : "border-[#d8d3c5] focus:border-[#A97C5B]"
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-500 font-light">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Mail size={14} className="text-[#A97C5B]" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ananya@example.com"
                  className={`w-full px-4 py-3 rounded bg-[#f5f2eb] border text-sm focus:outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border-[#d8d3c5] focus:border-[#A97C5B]"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500 font-light">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs uppercase tracking-wider font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Phone size={14} className="text-[#A97C5B]" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-3 rounded bg-[#f5f2eb] border text-sm focus:outline-none transition-colors ${
                    errors.phone ? "border-red-500" : "border-[#d8d3c5] focus:border-[#A97C5B]"
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500 font-light">{errors.phone}</p>}
              </div>

              {/* City / Address */}
              <div className="space-y-2">
                <label htmlFor="cityAddress" className="text-xs uppercase tracking-wider font-semibold text-neutral-700 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#A97C5B]" />
                  City &amp; Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="cityAddress"
                  type="text"
                  name="cityAddress"
                  value={formData.cityAddress}
                  onChange={handleChange}
                  placeholder="Bengaluru, Karnataka"
                  className={`w-full px-4 py-3 rounded bg-[#f5f2eb] border text-sm focus:outline-none transition-colors ${
                    errors.cityAddress ? "border-red-500" : "border-[#d8d3c5] focus:border-[#A97C5B]"
                  }`}
                />
                {errors.cityAddress && <p className="text-xs text-red-500 font-light">{errors.cityAddress}</p>}
              </div>

            </div>
          </div>

          {/* Section 2: Seat & Participant Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-[#1c1a17] border-b border-[#d8d3c5] pb-3">
              2. Number of Seats
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#f5f2eb] p-4 rounded border border-[#d8d3c5]">
              <div>
                <span className="text-sm font-semibold text-[#1c1a17] block">Select Participants</span>
                <span className="text-xs text-neutral-500">Maximum 3 seats allowed per registration</span>
              </div>

              <div className="flex items-center space-x-3">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleParticipantChange(num)}
                    className={`w-10 h-10 rounded font-serif text-sm font-bold transition-all cursor-pointer ${
                      formData.participantCount === num
                        ? "bg-[#A97C5B] text-white shadow"
                        : "bg-[#E2DDD3] text-neutral-700 hover:bg-[#d8d3c5]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Additional Equipment & Requests (Optional) */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold text-[#1c1a17] border-b border-[#d8d3c5] pb-3">
              3. Additional Details (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="cameraGearInfo" className="text-xs uppercase tracking-wider font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Camera size={14} className="text-[#A97C5B]" />
                  Your Camera Model &amp; Lenses
                </label>
                <input
                  id="cameraGearInfo"
                  type="text"
                  name="cameraGearInfo"
                  value={formData.cameraGearInfo}
                  onChange={handleChange}
                  placeholder="e.g. Sony A7IV with 85mm f/1.4"
                  className="w-full px-4 py-3 rounded bg-[#f5f2eb] border border-[#d8d3c5] text-sm focus:outline-none focus:border-[#A97C5B]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="specialRequests" className="text-xs uppercase tracking-wider font-semibold text-neutral-700 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#A97C5B]" />
                  Dietary / Special Requests
                </label>
                <input
                  id="specialRequests"
                  type="text"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="e.g. Vegetarian lunch preferred"
                  className="w-full px-4 py-3 rounded bg-[#f5f2eb] border border-[#d8d3c5] text-sm focus:outline-none focus:border-[#A97C5B]"
                />
              </div>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="border-t border-[#d8d3c5] pt-6 space-y-3">
            <div className="flex justify-between items-center text-sm text-neutral-600">
              <span>{data.formattedFee} x {formData.participantCount} Participant(s)</span>
              <span>₹{(perSeatFee * formData.participantCount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-neutral-600">
              <span>Studio Lunch &amp; Certificate Kit</span>
              <span className="text-[#A97C5B] font-medium">INCLUDED</span>
            </div>
            <div className="flex justify-between items-center text-lg sm:text-xl font-serif font-bold text-[#1c1a17] pt-2 border-t border-[#d8d3c5]">
              <span>Total Payable Amount</span>
              <span className="text-[#A97C5B]">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-[#A97C5B] hover:bg-[#966b4c] text-white font-medium text-xs uppercase tracking-[0.2em] rounded transition-colors duration-300 shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Proceed to Checkout Payment</span>
              <ArrowRight size={16} />
            </button>
            <p className="text-[11px] text-center text-neutral-400 mt-3 font-light">
              🔒 Frontend Demonstration Mode &ndash; Next step simulates checkout payment screen.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
}
