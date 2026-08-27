"use client";

import { useState } from "react";
import { WORKSHOP_DATA } from "@/data/workshop";
import WorkshopHero from "@/components/workshop/WorkshopHero";
import WorkshopHighlights from "@/components/workshop/WorkshopHighlights";
import WorkshopSchedule from "@/components/workshop/WorkshopSchedule";
import WorkshopDetails from "@/components/workshop/WorkshopDetails";
import WorkshopInstructor from "@/components/workshop/WorkshopInstructor";
import WorkshopRegistrationForm from "@/components/workshop/WorkshopRegistrationForm";
import WorkshopPaymentView from "@/components/workshop/WorkshopPaymentView";
import WorkshopTicketConfirmation from "@/components/workshop/WorkshopTicketConfirmation";

export default function WorkshopPage() {
  // Navigation Flow State: 'landing' | 'register' | 'payment' | 'confirmation'
  const [currentStep, setCurrentStep] = useState("landing");
  
  // Registration & Payment Data State
  const [registrationData, setRegistrationData] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);

  const handleStartRegistration = () => {
    setCurrentStep("register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToDetails = () => {
    const detailsElem = document.getElementById("details");
    if (detailsElem) {
      detailsElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProceedToPayment = (formData) => {
    setRegistrationData(formData);
    setCurrentStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSuccess = (paymentDetails) => {
    setConfirmationData(paymentDetails);
    setCurrentStep("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFlow = () => {
    setRegistrationData(null);
    setConfirmationData(null);
    setCurrentStep("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#f5f2eb] text-[#1c1a17]">
      {currentStep === "landing" && (
        <>
          <WorkshopHero
            data={WORKSHOP_DATA}
            onRegisterClick={handleStartRegistration}
            onDetailsClick={handleScrollToDetails}
          />

          <WorkshopHighlights
            highlights={WORKSHOP_DATA.highlights}
          />

          <WorkshopSchedule
            schedule={WORKSHOP_DATA.schedule}
          />

          <WorkshopDetails
            data={WORKSHOP_DATA}
          />

          <WorkshopInstructor
            instructor={WORKSHOP_DATA.instructor}
          />

          {/* Bottom Floating/Sticky Call-to-Action Bar */}
          <div className="sticky bottom-0 z-30 bg-[#1c1a17]/95 backdrop-blur border-t border-[#332f2b] p-4 text-[#f5f2eb]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-baseline space-x-3 text-center sm:text-left">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#A97C5B]">
                  {WORKSHOP_DATA.formattedFee}
                </span>
                <span className="text-xs uppercase tracking-wider text-neutral-400">
                  / Seat &bull; {WORKSHOP_DATA.date} ({WORKSHOP_DATA.availableSeats} Seats Left)
                </span>
              </div>

              <button
                onClick={handleStartRegistration}
                className="w-full sm:w-auto px-8 py-3 bg-[#A97C5B] hover:bg-[#966b4c] text-white font-medium text-xs uppercase tracking-[0.2em] rounded transition-colors duration-300 shadow-md cursor-pointer"
              >
                Reserve Your Seat Now
              </button>
            </div>
          </div>
        </>
      )}

      {currentStep === "register" && (
        <WorkshopRegistrationForm
          data={WORKSHOP_DATA}
          onProceedToPayment={handleProceedToPayment}
          onBackToDetails={() => {
            setCurrentStep("landing");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {currentStep === "payment" && (
        <WorkshopPaymentView
          data={WORKSHOP_DATA}
          registrationDetails={registrationData}
          onPaymentSuccess={handlePaymentSuccess}
          onBackToForm={() => {
            setCurrentStep("register");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {currentStep === "confirmation" && (
        <WorkshopTicketConfirmation
          data={WORKSHOP_DATA}
          paymentData={confirmationData}
          onReset={handleResetFlow}
        />
      )}
    </main>
  );
}
