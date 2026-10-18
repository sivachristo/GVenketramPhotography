"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Save,
  RotateCcw,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Sparkles,
} from "lucide-react";

export default function ContactSectionManager() {
  const [formData, setFormData] = useState({
    titlePrefix: "",
    titleHighlight: "",
    description: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    addressMapUrl: "",
    workingHours: "",
    formTitle: "",
    formHighlight: "",
  });

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchContactData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success && data.contact) {
        setFormData(data.contact);
        setInitialData(data.contact);
      }
    } catch (err) {
      console.error("Failed to fetch contact data:", err);
      showToast("Failed to load contact section data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  const hasChanges =
    initialData && JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setInitialData(data.contact);
        setFormData(data.contact);
        showToast("Contact information published successfully!");
      } else {
        throw new Error(data.error || "Failed to save contact settings");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast(err.message || "Failed to save changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      showToast("Reverted to last published state");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 text-neutral-500">
        <Loader2 className="animate-spin text-[#A97C5B]" size={36} />
        <p className="text-xs uppercase tracking-widest font-medium">Loading Contact Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 text-xs uppercase tracking-widest font-semibold border transition-all ${
            toast.type === "error"
              ? "bg-red-900 text-white border-red-700"
              : "bg-[#1c1a17] text-[#f5f2eb] border-[#A97C5B]"
          }`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={16} className="text-red-400" />
          ) : (
            <CheckCircle2 size={16} className="text-[#A97C5B]" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner Toolbar */}
      <div className="bg-[#faf8f5] p-6 rounded-xl border border-[#e6e2d8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#A97C5B]/10 text-[#A97C5B]">
              <Phone size={18} />
            </span>
            <h2 className="text-base sm:text-lg font-serif uppercase tracking-widest text-[#1c1a17] font-semibold">
              Contact Page Manager
            </h2>
            {hasChanges && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                Unsaved Edits
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Update studio phone numbers, WhatsApp routing, email address, physical location, and response times.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Link
            href="/contact"
            target="_blank"
            className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-[#d8d3c5] text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 font-medium"
            title="View Live Contact Page"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Preview Live</span>
            <ExternalLink size={12} className="opacity-50" />
          </Link>

          {hasChanges && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="px-3.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs uppercase tracking-widest rounded transition-all flex items-center gap-1.5 font-medium cursor-pointer"
              title="Discard changes"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`px-5 py-2 text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 font-medium cursor-pointer shadow-sm ${
              hasChanges
                ? "bg-[#A97C5B] text-white hover:bg-[#8e6547] animate-pulse"
                : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isSaving ? "Publishing..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left (7 Cols), Live Preview Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Page Header & Introduction */}
          <div className="bg-white p-6 rounded-xl border border-[#e6e2d8] shadow-xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A97C5B] font-semibold flex items-center gap-2 border-b border-neutral-100 pb-2">
              <Sparkles size={14} /> Header & Studio Introduction
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                    Title Prefix
                  </label>
                  <input
                    type="text"
                    value={formData.titlePrefix || ""}
                    onChange={(e) => handleInputChange("titlePrefix", e.target.value)}
                    placeholder="e.g. Get In"
                    className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors font-serif"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                    Highlighted Title (Italic Gold)
                  </label>
                  <input
                    type="text"
                    value={formData.titleHighlight || ""}
                    onChange={(e) => handleInputChange("titleHighlight", e.target.value)}
                    placeholder="e.g. Touch"
                    className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors font-serif italic text-[#A97C5B] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Introductory Statement / Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your creative services, booking timeline, and commercial campaigns..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* 2. Direct Contact Channels */}
          <div className="bg-white p-6 rounded-xl border border-[#e6e2d8] shadow-xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A97C5B] font-semibold flex items-center gap-2 border-b border-neutral-100 pb-2">
              <Mail size={14} /> Direct Contact Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1 flex items-center gap-1.5">
                    <Mail size={12} className="text-[#A97C5B]" /> Inquiries & Bookings Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="info@gvenketram.com"
                    className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1 flex items-center gap-1.5">
                    <Phone size={12} className="text-[#A97C5B]" /> Display Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 99400 69697"
                    className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A97C5B] font-semibold mb-1 flex items-center gap-1.5">
                  <Phone size={12} /> WhatsApp Target Number (Digits with country code, e.g. 919940069697)
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber || ""}
                  onChange={(e) => handleInputChange("whatsappNumber", e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="919940069697"
                  className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors font-mono"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Enquiries submitted through the contact form are formatted and routed directly to this WhatsApp number.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1 flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#A97C5B]" /> Studio Physical Address
                  </label>
                  <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="284 Mercer St, Soho, New York, NY 10003"
                    className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                    Google Maps Link URL
                  </label>
                  <input
                    type="text"
                    value={formData.addressMapUrl || ""}
                    onChange={(e) => handleInputChange("addressMapUrl", e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1 flex items-center gap-1.5">
                  <Clock size={12} className="text-[#A97C5B]" /> Working / Studio Hours
                </label>
                <input
                  type="text"
                  value={formData.workingHours || ""}
                  onChange={(e) => handleInputChange("workingHours", e.target.value)}
                  placeholder="Mon – Fri: 09:00 AM – 06:00 PM EST"
                  className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 3. Inquiry Form Headings */}
          <div className="bg-white p-6 rounded-xl border border-[#e6e2d8] shadow-xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#A97C5B] font-semibold flex items-center gap-2 border-b border-neutral-100 pb-2">
              <MessageSquare size={14} /> Inquiry Form Heading
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Form Heading Prefix
                </label>
                <input
                  type="text"
                  value={formData.formTitle || ""}
                  onChange={(e) => handleInputChange("formTitle", e.target.value)}
                  placeholder="Send a"
                  className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors font-serif"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-600 font-semibold mb-1">
                  Form Heading Highlight (Italic Gold)
                </label>
                <input
                  type="text"
                  value={formData.formHighlight || ""}
                  onChange={(e) => handleInputChange("formHighlight", e.target.value)}
                  placeholder="Message"
                  className="w-full px-3.5 py-2 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded-md focus:outline-none focus:border-[#1c1a17] transition-colors font-serif italic text-[#A97C5B] font-semibold"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Real-time Live Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#faf8f5] p-6 rounded-xl border border-[#d8d3c5] shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-[#e6e2d8] pb-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#A97C5B] font-semibold block">
                Live Preview
              </span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                Public /contact View
              </span>
            </div>

            {/* Title & Description Preview */}
            {(formData.titlePrefix?.trim() || formData.titleHighlight?.trim()) ? (
              <div className="space-y-3">
                <h4 className="text-2xl sm:text-3xl font-light uppercase tracking-widest text-[#1c1a17] font-serif leading-tight">
                  {formData.titlePrefix || ""}{formData.titlePrefix?.trim() && formData.titleHighlight?.trim() ? " " : ""}
                  {formData.titleHighlight?.trim() && (
                    <span className="font-semibold text-[#A97C5B] font-serif italic">
                      {formData.titleHighlight}
                    </span>
                  )}
                </h4>
                {formData.description?.trim() && (
                  <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-3">
                    {formData.description}
                  </p>
                )}
              </div>
            ) : formData.description?.trim() ? (
              <div className="space-y-3">
                <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-3">
                  {formData.description}
                </p>
              </div>
            ) : (
              <div className="py-4 text-center">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 italic">
                  No title or description set — section hidden on live page
                </span>
              </div>
            )}

            {/* Contact Items Preview */}
            <div className="space-y-3 pt-3 border-t border-[#e6e2d8] text-xs">
              {formData.email?.trim() ? (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white border border-[#e6e2d8] text-[#A97C5B] rounded">
                    <Mail size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#A97C5B] font-semibold block">
                      Inquiries & Bookings
                    </span>
                    <span className="font-light text-neutral-800">{formData.email}</span>
                  </div>
                </div>
              ) : null}

              {formData.phone?.trim() ? (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white border border-[#e6e2d8] text-[#A97C5B] rounded">
                    <Phone size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#A97C5B] font-semibold block">
                      Phone & WhatsApp
                    </span>
                    <span className="font-light text-neutral-800">{formData.phone}</span>
                    {formData.whatsappNumber?.trim() && (
                      <span className="block text-[9px] text-[#A97C5B] font-mono">
                        Target: +{formData.whatsappNumber}
                      </span>
                    )}
                  </div>
                </div>
              ) : null}

              {formData.address?.trim() ? (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white border border-[#e6e2d8] text-[#A97C5B] rounded">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#A97C5B] font-semibold block">
                      Studio Address
                    </span>
                    <span className="font-light text-neutral-800">{formData.address}</span>
                  </div>
                </div>
              ) : null}

              {formData.workingHours?.trim() ? (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white border border-[#e6e2d8] text-[#A97C5B] rounded">
                    <Clock size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#A97C5B] font-semibold block">
                      Response Times
                    </span>
                    <span className="font-light text-neutral-800">{formData.workingHours}</span>
                  </div>
                </div>
              ) : null}

              {!formData.email?.trim() && !formData.phone?.trim() && !formData.address?.trim() && !formData.workingHours?.trim() && (
                <div className="py-3 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 italic">
                    No contact details set — items hidden on live page
                  </span>
                </div>
              )}
            </div>

            {/* Form Title Preview Card */}
            {(formData.formTitle?.trim() || formData.formHighlight?.trim()) ? (
              <div className="p-4 bg-white border border-[#e6e2d8] rounded-lg">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Form Heading Preview
                </span>
                <p className="text-sm font-serif uppercase tracking-wider text-[#1c1a17]">
                  {formData.formTitle || ""}{formData.formTitle?.trim() && formData.formHighlight?.trim() ? " " : ""}
                  {formData.formHighlight?.trim() && (
                    <span className="font-semibold text-[#A97C5B] italic font-serif">
                      {formData.formHighlight}
                    </span>
                  )}
                </p>
              </div>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
}
