"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, CreditCard, QrCode, Building2, CheckCircle2, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { fadeIn } from "@/utils/animations";

export default function WorkshopPaymentView({ data, registrationDetails, onPaymentSuccess, onBackToForm }) {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const participantCount = registrationDetails?.participantCount || 1;
  const totalAmount = data.fee * participantCount;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Generate a mock unique registration token
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const tokenNumber = `WRK-2026-${randomNum}`;
      onPaymentSuccess({
        ...registrationDetails,
        tokenNumber: tokenNumber,
        paymentStatus: "SUCCESSFUL",
        paymentMethod: selectedMethod.toUpperCase(),
        paidAmount: totalAmount,
        paidAt: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      });
    }, 1500);
  };

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-12 bg-[#f5f2eb] min-h-screen text-[#1c1a17]">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <button
          onClick={onBackToForm}
          disabled={isProcessing}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-neutral-600 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Modify Registration Details</span>
        </button>

        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#A97C5B] font-semibold block">
            Step 2 of 3 &ndash; Payment Gateway Simulation
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-light uppercase tracking-wider text-[#1c1a17]">
            Workshop <span className="font-semibold text-[#A97C5B] italic font-serif">Checkout</span>
          </h1>
        </div>

        {/* Demo Warning Banner */}
        <div className="p-4 rounded-lg bg-[#faf8f5] border border-[#A97C5B]/40 flex items-start space-x-3 text-xs text-neutral-700">
          <ShieldAlert size={20} className="text-[#A97C5B] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-[#1c1a17] block uppercase tracking-wider">
              Frontend Simulation Mode (No Real Money Charged)
            </span>
            <p className="font-light leading-relaxed">
              This screen demonstrates the payment flow UI. Clicking &quot;Simulate Successful Payment&quot; will immediately generate your official workshop ticket confirmation pass.
            </p>
          </div>
        </div>

        {/* Order Summary & Payment Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Booking Summary */}
          <div className="md:col-span-5 bg-[#E2DDD3]/70 p-6 rounded-xl border border-[#d8d3c5] space-y-6">
            <h3 className="text-lg font-serif font-semibold text-[#1c1a17] border-b border-[#d8d3c5] pb-3">
              Booking Summary
            </h3>

            <div className="space-y-4 text-xs text-neutral-700">
              <div>
                <span className="text-neutral-500 block uppercase tracking-widest text-[10px]">Primary Participant</span>
                <span className="font-semibold text-sm text-[#1c1a17]">{registrationDetails?.fullName}</span>
              </div>

              <div>
                <span className="text-neutral-500 block uppercase tracking-widest text-[10px]">Contact</span>
                <span>{registrationDetails?.email}</span>
                <span className="block">{registrationDetails?.phone}</span>
              </div>

              <div>
                <span className="text-neutral-500 block uppercase tracking-widest text-[10px]">Workshop</span>
                <span className="font-medium text-[#1c1a17]">{data.title}</span>
              </div>

              <div>
                <span className="text-neutral-500 block uppercase tracking-widest text-[10px]">Dates &amp; Venue</span>
                <span>{data.dateFormatted}</span>
                <span className="block text-neutral-600 font-light">{data.venue.name}</span>
              </div>

              <div className="border-t border-[#d8d3c5] pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Seats ({participantCount})</span>
                  <span>₹{(data.fee * participantCount).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#1c1a17] pt-2 border-t border-[#d8d3c5]">
                  <span>Total Amount</span>
                  <span className="text-[#A97C5B]">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Tabs & Simulation Button */}
          <div className="md:col-span-7 bg-[#faf8f5] p-6 sm:p-8 rounded-xl border border-[#d8d3c5] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-semibold text-[#1c1a17] border-b border-[#d8d3c5] pb-3">
                Select Payment Method
              </h3>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("upi")}
                  className={`p-3 rounded border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedMethod === "upi"
                      ? "border-[#A97C5B] bg-[#f5f2eb] text-[#A97C5B] font-semibold"
                      : "border-[#d8d3c5] bg-white text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  <QrCode size={20} />
                  <span className="text-xs">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("card")}
                  className={`p-3 rounded border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedMethod === "card"
                      ? "border-[#A97C5B] bg-[#f5f2eb] text-[#A97C5B] font-semibold"
                      : "border-[#d8d3c5] bg-white text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  <CreditCard size={20} />
                  <span className="text-xs">Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("netbanking")}
                  className={`p-3 rounded border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedMethod === "netbanking"
                      ? "border-[#A97C5B] bg-[#f5f2eb] text-[#A97C5B] font-semibold"
                      : "border-[#d8d3c5] bg-white text-neutral-600 hover:border-neutral-400"
                  }`}
                >
                  <Building2 size={20} />
                  <span className="text-xs">Netbanking</span>
                </button>
              </div>

              {/* Selected Method Detail Box */}
              <div className="p-4 bg-[#f5f2eb] rounded border border-[#d8d3c5] text-xs text-neutral-600 space-y-2">
                {selectedMethod === "upi" && (
                  <p>Pay instantly using GPay, PhonePe, Paytm, or BHIM UPI string.</p>
                )}
                {selectedMethod === "card" && (
                  <p>Supports Visa, Mastercard, RuPay &amp; American Express debit or credit cards.</p>
                )}
                {selectedMethod === "netbanking" && (
                  <p>Select from 50+ major Indian banks including HDFC, ICICI, SBI, and Axis.</p>
                )}
                <div className="flex items-center space-x-1 text-[11px] text-neutral-500 font-medium">
                  <Lock size={12} className="text-[#A97C5B]" />
                  <span>Ready for Razorpay / Stripe backend integration in Phase 2</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-[#d8d3c5] space-y-3">
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-4 bg-[#A97C5B] hover:bg-[#966b4c] text-white font-medium text-xs uppercase tracking-[0.2em] rounded transition-colors duration-300 shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing Payment Simulation...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Simulate Successful Payment (₹{totalAmount.toLocaleString("en-IN")})</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-neutral-400">
                Encrypted 256-bit connection &bull; Workshop seat will be confirmed instantly.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
