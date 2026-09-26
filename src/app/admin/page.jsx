"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Search,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Image as ImageIcon,
  Eye,
  ExternalLink,
  Pencil,
  Check,
  Calendar,
  Users,
  DollarSign,
  Download,
  Filter,
  UserPlus,
  Clock,
  MapPin,
  ShieldCheck,
  Ticket,
  User,
  Mail,
  Phone,
  Lock,
  LogOut,
  EyeOff,
  Sliders,
  Settings as SettingsIcon,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import AddPortfolioImageModal from "@/components/admin/AddPortfolioImageModal";
import EditPortfolioImageModal from "@/components/admin/EditPortfolioImageModal";
import ArtworkModal from "@/components/admin/ArtworkModal";
import {
  PortfolioCategoryTabsSkeleton,
  PortfolioSkeletonGrid,
  ArtGallerySkeletonGrid
} from "@/components/admin/AdminSkeletons";

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "g-venketram";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "12345";

export default function AdminPage() {
  // ── Login Gate ────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("gvr_admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");
    setTimeout(() => {
      if (loginUsername.trim() === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD) {
        sessionStorage.setItem("gvr_admin_auth", "true");
        setIsAuthenticated(true);
      } else {
        setLoginError("Invalid username or password.");
      }
      setIsLoggingIn(false);
    }, 400);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("gvr_admin_auth");
    setIsAuthenticated(false);
    setLoginUsername("");
    setLoginPassword("");
  };

  // ── Main State ────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Full View Image Preview Modal State
  const [previewImage, setPreviewImage] = useState(null);

  // Portfolio Edit Modal State
  const [portfolioEditModal, setPortfolioEditModal] = useState(null);

  // Delete Confirmation Modal State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

  // Add Image Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [modifiedFieldsMap, setModifiedFieldsMap] = useState({});

  // Main Admin Dashboard Tab: 'portfolio' | 'art-gallery' | 'workshop'
  const [mainTab, setMainTab] = useState("portfolio");

  // Art Gallery State
  const [artworksList, setArtworksList] = useState([]);
  const [artCategoryFilter, setArtCategoryFilter] = useState("All");
  const [artSearchQuery, setArtSearchQuery] = useState("");
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null); // null = Create Mode, object = Edit Mode
  const [artworkDeleteTarget, setArtworkDeleteTarget] = useState(null);

  // Workshop Management State (Frontend Only)
  const [workshopData, setWorkshopData] = useState({
    id: "wrk-2026-masterclass",
    title: "Mastering Studio & Environmental Light",
    subtitle: "Sculpting Shadow, Mood & Emotion in Editorial Portraiture",
    badge: "OFFLINE INTENSIVE MASTERCLASS",
    date: "October 18 – 19, 2026",
    time: "10:00 AM – 05:00 PM IST",
    duration: "2 Full Days (14 Hours)",
    venue: "G. Venket Ram Photography Studios, Chennai",
    fee: 24500,
    totalSeats: 15,
    availableSeats: 4,
    instructorName: "G. Venket Ram",
    status: "Active",
  });

  const [registrationsList, setRegistrationsList] = useState([
    {
      tokenNumber: "WRK-2026-00125",
      fullName: "Ananya Sharma",
      email: "ananya.sharma@example.com",
      phone: "+91 98765 43210",
      cityAddress: "Bengaluru, Karnataka",
      participantCount: 1,
      paidAmount: 24500,
      paymentStatus: "SUCCESSFUL",
      paymentMethod: "UPI",
      registeredAt: "2026-08-20 14:30 IST",
      checkedIn: true,
      cameraGear: "Sony A7 IV with 85mm f/1.4",
      specialRequests: "Vegetarian lunch",
    },
    {
      tokenNumber: "WRK-2026-00126",
      fullName: "Rohan Varma",
      email: "rohan.v@example.com",
      phone: "+91 98123 45678",
      cityAddress: "Chennai, Tamil Nadu",
      participantCount: 2,
      paidAmount: 49000,
      paymentStatus: "SUCCESSFUL",
      paymentMethod: "CARD",
      registeredAt: "2026-08-21 10:15 IST",
      checkedIn: false,
      cameraGear: "Canon EOS R5 with 24-70mm f/2.8",
      specialRequests: "None",
    },
    {
      tokenNumber: "WRK-2026-00127",
      fullName: "Priya Nair",
      email: "priya.nair@example.com",
      phone: "+91 99887 76655",
      cityAddress: "Kochi, Kerala",
      participantCount: 1,
      paidAmount: 24500,
      paymentStatus: "SUCCESSFUL",
      paymentMethod: "NETBANKING",
      registeredAt: "2026-08-22 18:45 IST",
      checkedIn: false,
      cameraGear: "Nikon Z8 with 50mm f/1.2",
      specialRequests: "Wheelchair access",
    },
    {
      tokenNumber: "WRK-2026-00128",
      fullName: "Vikramaditya Roy",
      email: "vikram.roy@example.com",
      phone: "+91 97654 32109",
      cityAddress: "Mumbai, Maharashtra",
      participantCount: 1,
      paidAmount: 24500,
      paymentStatus: "SUCCESSFUL",
      paymentMethod: "UPI",
      registeredAt: "2026-08-24 11:20 IST",
      checkedIn: false,
      cameraGear: "Fujifilm GFX 100 II",
      specialRequests: "None",
    },
    {
      tokenNumber: "WRK-2026-00129",
      fullName: "Siddharth Menon",
      email: "siddharth.m@example.com",
      phone: "+91 94433 22110",
      cityAddress: "Hyderabad, Telangana",
      participantCount: 2,
      paidAmount: 49000,
      paymentStatus: "PENDING",
      paymentMethod: "CARD",
      registeredAt: "2026-08-26 16:05 IST",
      checkedIn: false,
      cameraGear: "Sony A1 with 70-200mm f/2.8",
      specialRequests: "Late arrival on Day 1",
    },
  ]);

  const [regSearchQuery, setRegSearchQuery] = useState("");
  const [regStatusFilter, setRegStatusFilter] = useState("All");

  // Workshop Modals
  const [isEditWorkshopModalOpen, setIsEditWorkshopModalOpen] = useState(false);
  const [isAddRegModalOpen, setIsAddRegModalOpen] = useState(false);
  const [selectedRegDetail, setSelectedRegDetail] = useState(null);
  const [deleteRegTarget, setDeleteRegTarget] = useState(null);

  // New Manual Registration Form State
  const [manualRegForm, setManualRegForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    cityAddress: "Chennai",
    participantCount: 1,
    paymentStatus: "SUCCESSFUL",
    paymentMethod: "UPI",
    cameraGear: "",
    specialRequests: "",
  });

  // Load Initial Portfolio Data & Artworks
  useEffect(() => {
    fetchPortfolioData();
    fetchArtworksData();
  }, []);

  const fetchPortfolioData = async () => {
    setIsLoadingPortfolio(true);
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setPortfolioData(data.portfolioData || []);
        setModifiedFieldsMap({});
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
      showToast("Failed to load data from server", "error");
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  const fetchArtworksData = async () => {
    setIsLoadingArtworks(true);
    try {
      const res = await fetch("/api/artworks");
      if (res.ok) {
        const data = await res.json();
        setArtworksList(data.artworks || []);
      }
    } catch (err) {
      console.error("Failed to load artworks data:", err);
    } finally {
      setIsLoadingArtworks(false);
    }
  };

  const handleOpenPortfolioEditModal = (img) => {
    setPortfolioEditModal(img);
  };

  const handlePortfolioEditSuccess = (updatedImage, oldCategory, newCategory) => {
    setPortfolioData((prev) => {
      if (oldCategory === newCategory) {
        return prev.map((cat) =>
          cat.category === newCategory
            ? {
                ...cat,
                images: cat.images.map((i) =>
                  (updatedImage.id && i.id === updatedImage.id) || i.src === updatedImage.src
                    ? updatedImage
                    : i
                ),
              }
            : cat
        );
      } else {
        const removedFromOld = prev.map((cat) => {
          if (cat.category === oldCategory) {
            return {
              ...cat,
              images: cat.images.filter((i) =>
                !((updatedImage.id && i.id === updatedImage.id) || i.src === updatedImage.src)
              ),
            };
          }
          return cat;
        });

        let found = false;
        const addedToNew = removedFromOld.map((cat) => {
          if (cat.category === newCategory) {
            found = true;
            return { ...cat, images: [updatedImage, ...cat.images] };
          }
          return cat;
        });

        if (!found) {
          addedToNew.push({ category: newCategory, images: [updatedImage] });
        }

        return addedToNew;
      }
    });
  };

  const handleOpenCreateArtworkModal = () => {
    setEditingArtwork(null);
    setIsArtworkModalOpen(true);
  };

  const handleOpenEditArtworkModal = (art) => {
    setEditingArtwork(art);
    setIsArtworkModalOpen(true);
  };

  const handleArtworkSuccess = (artwork, isEdit) => {
    if (isEdit) {
      setArtworksList((prev) =>
        prev.map((item) => (item.id === artwork.id ? artwork : item))
      );
    } else {
      setArtworksList((prev) => [artwork, ...prev]);
    }
  };

  const handleDeleteArtwork = async () => {
    if (!artworkDeleteTarget) return;

    try {
      const res = await fetch(`/api/artworks?id=${artworkDeleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setArtworksList((prev) => prev.filter((item) => item.id !== artworkDeleteTarget.id));
        showToast(`Deleted artwork "${artworkDeleteTarget.title}"`);
        setArtworkDeleteTarget(null);
      } else {
        showToast("Failed to delete artwork", "error");
      }
    } catch (err) {
      console.error("Error deleting artwork:", err);
      showToast("Error deleting artwork", "error");
    }
  };

  // --- Workshop Handlers (Frontend State) ---
  const handleToggleCheckIn = (tokenNumber) => {
    setRegistrationsList((prev) =>
      prev.map((item) =>
        item.tokenNumber === tokenNumber ? { ...item, checkedIn: !item.checkedIn } : item
      )
    );
    const target = registrationsList.find((r) => r.tokenNumber === tokenNumber);
    const newStatus = target && !target.checkedIn ? "Checked In" : "Pending Check-In";
    showToast(`Updated ${target?.fullName || "Participant"} status to: ${newStatus}`);
  };

  const handleSaveWorkshopDetails = (e) => {
    e.preventDefault();
    setIsEditWorkshopModalOpen(false);
    showToast("Workshop masterclass settings updated!");
  };

  const handleAddManualRegistration = (e) => {
    e.preventDefault();
    if (!manualRegForm.fullName || !manualRegForm.email || !manualRegForm.phone) {
      showToast("Please fill in required fields (Name, Email, Phone)", "error");
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newToken = `WRK-2026-${randomNum}`;
    const seats = Number(manualRegForm.participantCount) || 1;
    const amount = workshopData.fee * seats;

    const newReg = {
      tokenNumber: newToken,
      fullName: manualRegForm.fullName,
      email: manualRegForm.email,
      phone: manualRegForm.phone,
      cityAddress: manualRegForm.cityAddress || "Chennai",
      participantCount: seats,
      paidAmount: amount,
      paymentStatus: manualRegForm.paymentStatus,
      paymentMethod: manualRegForm.paymentMethod,
      registeredAt: new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }),
      checkedIn: false,
      cameraGear: manualRegForm.cameraGear || "N/A",
      specialRequests: manualRegForm.specialRequests || "None",
    };

    setRegistrationsList((prev) => [newReg, ...prev]);
    setWorkshopData((prev) => ({
      ...prev,
      availableSeats: Math.max(0, prev.availableSeats - seats),
    }));

    setIsAddRegModalOpen(false);
    setManualRegForm({
      fullName: "",
      email: "",
      phone: "",
      cityAddress: "Chennai",
      participantCount: 1,
      paymentStatus: "SUCCESSFUL",
      paymentMethod: "UPI",
      cameraGear: "",
      specialRequests: "",
    });

    showToast(`Added manual registration for ${newReg.fullName} (${newToken})`);
  };

  const handleDeleteRegistration = () => {
    if (!deleteRegTarget) return;
    setRegistrationsList((prev) => prev.filter((r) => r.tokenNumber !== deleteRegTarget.tokenNumber));
    setWorkshopData((prev) => ({
      ...prev,
      availableSeats: Math.min(prev.totalSeats, prev.availableSeats + (deleteRegTarget.participantCount || 1)),
    }));
    showToast(`Cancelled registration ${deleteRegTarget.tokenNumber}`);
    setDeleteRegTarget(null);
  };

  const handleExportRegistrationsCSV = () => {
    const headers = ["Token", "Full Name", "Email", "Phone", "City", "Seats", "Paid Amount", "Status", "Payment Method", "Checked In"];
    const rows = registrationsList.map((r) => [
      r.tokenNumber,
      `"${r.fullName}"`,
      r.email,
      r.phone,
      `"${r.cityAddress}"`,
      r.participantCount,
      r.paidAmount,
      r.paymentStatus,
      r.paymentMethod,
      r.checkedIn ? "YES" : "NO",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WRK-2026-Registrations-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Downloaded Registrations CSV");
  };

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Trigger PATCH /api/portfolio for modified records / batch updates
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const entries = Object.entries(modifiedFieldsMap);

      if (entries.length === 0) {
        setHasUnsavedChanges(false);
        setIsSaving(false);
        showToast("No changes to save.");
        return;
      }

      const itemsToUpdate = entries.map(([id, changes]) => ({
        id,
        ...changes,
      }));

      const res = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "batch_update",
          items: itemsToUpdate,
        }),
      });

      if (res.ok) {
        setModifiedFieldsMap({});
        setHasUnsavedChanges(false);
        showToast("Changes saved successfully!");
      } else {
        showToast("Failed to save changes", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      showToast("Error saving changes", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Update inline image title & description metadata (buffers change until Save Changes)
  const handleUpdateImageMetadata = (categoryName, imageSrc, field, value, imageId) => {
    const updatedData = portfolioData.map((cat) => {
      if (cat.category === categoryName) {
        const updatedImages = cat.images.map((img) => {
          if ((imageId && img.id === imageId) || img.src === imageSrc) {
            return {
              ...img,
              [field]: value,
            };
          }
          return img;
        });
        return { ...cat, images: updatedImages };
      }
      return cat;
    });

    setPortfolioData(updatedData);
    setHasUnsavedChanges(true);

    if (imageId) {
      setModifiedFieldsMap((prev) => ({
        ...prev,
        [imageId]: {
          ...(prev[imageId] || {}),
          [field]: value,
        },
      }));
    }
  };

  // Re-assign Image Tag / Category (buffers change until Save Changes)
  const handleTagChange = (targetCategoryName, imageSrc, currentCategoryName, imageId) => {
    if (targetCategoryName === currentCategoryName) return;

    let movedImage = null;

    // Remove image from old category
    const updatedData = portfolioData.map((cat) => {
      if (cat.category === currentCategoryName) {
        const filtered = cat.images.filter((img) => {
          if ((imageId && img.id === imageId) || img.src === imageSrc) {
            movedImage = { ...img, category: targetCategoryName };
            return false;
          }
          return true;
        });
        return { ...cat, images: filtered };
      }
      return cat;
    });

    if (!movedImage) return;

    // Add image to new target category
    const finalData = updatedData.map((cat) => {
      if (cat.category === targetCategoryName) {
        return {
          ...cat,
          images: [movedImage, ...cat.images],
        };
      }
      return cat;
    });

    setPortfolioData(finalData);
    setHasUnsavedChanges(true);

    if (imageId) {
      setModifiedFieldsMap((prev) => ({
        ...prev,
        [imageId]: {
          ...(prev[imageId] || {}),
          category: targetCategoryName,
        },
      }));
    }
  };

  // Directly move image to target position number (1-based index)
  const handleSetPosition = (categoryName, imageSrc, targetPos, imageId) => {
    const catObj = portfolioData.find((c) => c.category === categoryName);
    if (!catObj) return;

    const currentIdx = catObj.images.findIndex(
      (img) => (imageId && img.id === imageId) || img.src === imageSrc
    );
    if (currentIdx === -1) return;

    const targetIdx = Math.max(0, Math.min(targetPos - 1, catObj.images.length - 1));
    if (currentIdx === targetIdx) return;

    const images = [...catObj.images];
    const [movedItem] = images.splice(currentIdx, 1);
    images.splice(targetIdx, 0, movedItem);

    // Resequence 1..N
    const resequenced = images.map((img, i) => ({
      ...img,
      display_order: i + 1,
      position_num: i + 1,
    }));

    const updatedData = portfolioData.map((cat) =>
      cat.category === categoryName ? { ...cat, images: resequenced } : cat
    );

    setPortfolioData(updatedData);
    setHasUnsavedChanges(true);

    // Track updated display_order in modifiedFieldsMap
    const newMap = { ...modifiedFieldsMap };
    resequenced.forEach((img, i) => {
      if (img.id) {
        newMap[img.id] = {
          ...(newMap[img.id] || {}),
          display_order: i + 1,
          position_num: i + 1,
        };
      }
    });
    setModifiedFieldsMap(newMap);
  };

  // Reorder Image using step direction
  const handleReorder = (categoryName, imageSrc, direction) => {
    const catObj = portfolioData.find((c) => c.category === categoryName);
    if (!catObj) return;

    const inCatIndex = catObj.images.findIndex((i) => i.src === imageSrc);
    if (inCatIndex === -1) return;

    const targetPos = direction === "up" ? inCatIndex : inCatIndex + 2;
    handleSetPosition(categoryName, imageSrc, targetPos, catObj.images[inCatIndex]?.id);
  };

  // Request Image Removal (opens custom modal)
  const handleRemoveImage = (categoryName, imageSrc, imageTitle, imageId) => {
    setDeleteConfirmTarget({
      categoryName,
      imageSrc,
      imageTitle,
      imageId,
    });
  };

  // Confirm Image Removal via RESTful DELETE /api/portfolio/[id]
  const confirmDeleteImage = async () => {
    if (!deleteConfirmTarget) return;
    const { categoryName, imageSrc, imageTitle, imageId } = deleteConfirmTarget;

    const updatedData = portfolioData.map((cat) => {
      if (cat.category === categoryName) {
        return {
          ...cat,
          images: cat.images.filter((img) => (imageId ? img.id !== imageId : img.src !== imageSrc)),
        };
      }
      return cat;
    });

    setPortfolioData(updatedData);
    setDeleteConfirmTarget(null);

    if (imageId) {
      try {
        const res = await fetch(`/api/portfolio/${imageId}`, {
          method: "DELETE",
        });

        if (res.ok) {
          showToast(`Removed "${imageTitle || "Image"}"`);
        } else {
          const err = await res.json();
          showToast(err.error || "Failed to delete image", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        showToast("Error deleting image", "error");
      }
    }
  };

  // Callback when images are successfully created via AddPortfolioImageModal
  const handlePortfolioImagesAdded = (createdItems, targetCategory) => {
    let foundCategory = false;
    const updatedData = portfolioData.map((cat) => {
      if (cat.category.toLowerCase() === targetCategory.toLowerCase()) {
        foundCategory = true;
        const combined = [...createdItems, ...cat.images];
        const resequenced = combined.map((img, i) => ({
          ...img,
          display_order: i + 1,
          position_num: i + 1,
        }));
        return {
          ...cat,
          images: resequenced,
        };
      }
      return cat;
    });

    if (!foundCategory) {
      updatedData.push({
        category: targetCategory,
        images: createdItems,
      });
    }

    setPortfolioData(updatedData);
    showToast(
      createdItems.length > 1
        ? `Successfully added ${createdItems.length} image(s) to "${targetCategory}"!`
        : `Added new image to "${targetCategory}"!`
    );
  };

  // Flatten images for workspace listing
  const allImagesWithCategory = portfolioData.flatMap((cat) =>
    cat.images.map((img) => ({
      ...img,
      category: cat.category,
    }))
  );

  const displayedImages = allImagesWithCategory.filter((img) => {
    const matchesCategory = activeCategory === "All" || img.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ── Login screen ─────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1c1a17] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#f5f2eb]/10 border border-[#f5f2eb]/20 mb-4">
              <Lock size={22} className="text-[#f5f2eb]/70" />
            </div>
            <h1 className="text-2xl font-serif uppercase tracking-[0.2em] text-[#f5f2eb] font-bold">
              G. Venket Ram
            </h1>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#f5f2eb]/40 mt-1 font-light">
              Admin Dashboard
            </p>
          </div>

          {/* Login Card */}
          <form
            onSubmit={handleLogin}
            className="bg-[#f5f2eb] rounded-2xl shadow-2xl p-8 space-y-5"
          >
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1.5">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                placeholder="g-venketram"
                value={loginUsername}
                onChange={(e) => { setLoginUsername(e.target.value); setLoginError(""); }}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e6e2d8] rounded-lg focus:outline-none focus:border-[#1c1a17] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e6e2d8] rounded-lg focus:outline-none focus:border-[#1c1a17] transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {loginError && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-600 font-medium flex items-center gap-1.5"
                >
                  <AlertCircle size={13} />
                  {loginError}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-[#1c1a17] text-[#f5f2eb] text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoggingIn ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Lock size={13} />
              )}
              {isLoggingIn ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#1c1a17] pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 text-xs uppercase tracking-widest font-semibold border ${toastMessage.type === "error"
                ? "bg-red-900 text-white border-red-700"
                : "bg-[#1c1a17] text-[#f5f2eb] border-neutral-700"
              }`}
          >
            {toastMessage.type === "error" ? (
              <AlertCircle size={16} className="text-red-400" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-400" />
            )}
            <span>{toastMessage.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#E2DDD3] border-b border-[#d8d3c5] shadow-xs px-4 sm:px-8 py-4">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-serif uppercase tracking-widest text-[#1c1a17] font-semibold flex items-center gap-2">
              <Layers size={18} /> Admin Dashboard
            </h1>
          </div>

          {/* Tab Switcher: Portfolio vs Art Gallery vs Workshop */}
          <div className="flex items-center space-x-1 bg-[#f5f2eb] border border-[#d8d3c5] p-1 rounded-lg">
            <button
              onClick={() => setMainTab("portfolio")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded font-medium transition-all cursor-pointer ${mainTab === "portfolio"
                  ? "bg-[#1c1a17] text-[#f5f2eb] shadow-xs font-semibold"
                  : "text-neutral-600 hover:text-black"
                }`}
            >
              Portfolio Collections
            </button>
            <button
              onClick={() => setMainTab("art-gallery")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded font-medium transition-all cursor-pointer ${mainTab === "art-gallery"
                  ? "bg-[#1c1a17] text-[#f5f2eb] shadow-xs font-semibold"
                  : "text-neutral-600 hover:text-black"
                }`}
            >
              Art Gallery ({artworksList.length})
            </button>
            <button
              onClick={() => setMainTab("workshop")}
              className={`px-4 py-1.5 text-xs uppercase tracking-wider rounded font-medium transition-all cursor-pointer ${mainTab === "workshop"
                  ? "bg-[#1c1a17] text-[#f5f2eb] shadow-xs font-semibold"
                  : "text-neutral-600 hover:text-black"
                }`}
            >
              Workshops & Registrations ({registrationsList.length})
            </button>
          </div>

          {/* Action Header Buttons */}
          {mainTab === "portfolio" ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#1c1a17] text-[#f5f2eb] hover:bg-neutral-800 text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 cursor-pointer font-medium"
              >
                <Plus size={15} />
                Add Portfolio Image
              </button>

              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`px-5 py-2 text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 font-medium cursor-pointer shadow-sm ${hasUnsavedChanges
                    ? "bg-amber-700 text-white hover:bg-amber-800 animate-pulse"
                    : "bg-neutral-800 text-neutral-300 hover:bg-black"
                  }`}
              >
                <Save size={15} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : mainTab === "art-gallery" ? (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={handleOpenCreateArtworkModal}
                className="px-4 py-2 bg-[#A97C5B] text-white hover:bg-[#1c1a17] text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 cursor-pointer font-medium shadow-sm"
              >
                <Plus size={15} />
                Add Artwork Item
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsEditWorkshopModalOpen(true)}
                className="px-4 py-2 bg-[#E2DDD3] text-[#1c1a17] border border-[#d8d3c5] hover:bg-neutral-200 text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 cursor-pointer font-medium"
              >
                <Pencil size={15} />
                Masterclass Settings
              </button>
              <button
                onClick={() => setIsAddRegModalOpen(true)}
                className="px-4 py-2 bg-[#A97C5B] text-white hover:bg-[#1c1a17] text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2 cursor-pointer font-medium shadow-sm"
              >
                <UserPlus size={15} />
                New Registration
              </button>
            </div>
          )}

        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="w-full px-4 sm:px-8 py-8">

        {mainTab === "art-gallery" ? (
          /* ART GALLERY MANAGEMENT VIEW */
          <div className="space-y-8">
            {/* Toolbar for Art Gallery */}
            <div className="bg-[#faf8f5] p-6 rounded-lg border border-[#e6e2d8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search artworks..."
                    value={artSearchQuery}
                    onChange={(e) => setArtSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {["All", "Physical Prints", "Digital Prints"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setArtCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded font-medium transition-colors whitespace-nowrap cursor-pointer ${artCategoryFilter === cat
                          ? "bg-[#1c1a17] text-white"
                          : "bg-white border border-[#e6e2d8] text-neutral-600 hover:text-black"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-neutral-500 uppercase tracking-widest font-medium">
                Total Items: {artworksList.length}
              </span>
            </div>

            {/* Artworks List Grid */}
            {isLoadingArtworks ? (
              <ArtGallerySkeletonGrid />
            ) : (() => {
              const filteredArtworks = artworksList.filter((art) => {
                const matchesCat = artCategoryFilter === "All" || art.category === artCategoryFilter;
                const matchesSearch =
                  !artSearchQuery ||
                  art.title.toLowerCase().includes(artSearchQuery.toLowerCase()) ||
                  art.category.toLowerCase().includes(artSearchQuery.toLowerCase());
                return matchesCat && matchesSearch;
              });

              if (filteredArtworks.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#e6e2d8] rounded-lg bg-[#faf8f5]">
                    <ImageIcon size={40} className="text-neutral-300 mb-3" />
                    <p className="text-sm uppercase tracking-widest text-neutral-400">No artwork items found.</p>
                    <button
                      onClick={handleOpenCreateArtworkModal}
                      className="mt-4 px-4 py-2 bg-[#A97C5B] text-white text-xs uppercase tracking-widest rounded font-medium hover:bg-[#1c1a17] transition-colors cursor-pointer"
                    >
                      Add Artwork Item
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredArtworks.map((art) => (
                    <div
                      key={art.id}
                      className="bg-[#faf8f5] border border-[#e6e2d8] rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="relative h-56 w-full bg-neutral-200 overflow-hidden group">
                        <Image
                          src={art.image}
                          alt={art.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute top-2 left-2 bg-[#1c1a17]/85 text-[#f5f2eb] px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1 backdrop-blur-xs">
                          <Tag size={10} />
                          {art.type || "Art"}
                        </div>
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditArtworkModal(art)}
                            className="p-2 bg-[#1c1a17]/90 text-white rounded hover:bg-black transition-colors shadow-sm cursor-pointer"
                            title="Edit Artwork"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setArtworkDeleteTarget(art)}
                            className="p-2 bg-red-600/90 text-white rounded hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                            title="Delete Artwork"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-serif font-semibold text-sm text-[#1c1a17] line-clamp-1">{art.title}</h3>
                          <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{art.shortDescription}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-[#e6e2d8] pt-3 text-xs font-semibold text-[#1c1a17]">
                          <span className="font-serif font-bold text-sm text-[#A97C5B]">₹{art.price}</span>
                          <span className="text-[10px] uppercase tracking-widest text-neutral-500">{art.availability}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ) : mainTab === "workshop" ? (
          /* WORKSHOP & REGISTRATIONS MANAGEMENT VIEW */
          <div className="space-y-8">

            {/* Top Summary Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#faf8f5] p-6 rounded-xl border border-[#d8d3c5] shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-500 block">Total Revenue</span>
                  <span className="text-2xl font-serif font-bold text-[#1c1a17]">
                    ₹{registrationsList.filter((r) => r.paymentStatus === "SUCCESSFUL").reduce((acc, curr) => acc + curr.paidAmount, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-3 bg-[#E2DDD3] rounded-lg text-[#A97C5B]">
                  <DollarSign size={24} />
                </div>
              </div>

              <div className="bg-[#faf8f5] p-6 rounded-xl border border-[#d8d3c5] shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-500 block">Total Registrations</span>
                  <span className="text-2xl font-serif font-bold text-[#1c1a17]">{registrationsList.length} Attendees</span>
                </div>
                <div className="p-3 bg-[#E2DDD3] rounded-lg text-[#A97C5B]">
                  <Users size={24} />
                </div>
              </div>

              <div className="bg-[#faf8f5] p-6 rounded-xl border border-[#d8d3c5] shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-500 block">Seats Remaining</span>
                  <span className="text-2xl font-serif font-bold text-[#A97C5B]">{workshopData.availableSeats} of {workshopData.totalSeats}</span>
                </div>
                <div className="p-3 bg-[#E2DDD3] rounded-lg text-[#A97C5B]">
                  <Ticket size={24} />
                </div>
              </div>

              <div className="bg-[#faf8f5] p-6 rounded-xl border border-[#d8d3c5] shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-500 block">Masterclass Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs uppercase tracking-wider font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 size={13} /> {workshopData.status}
                  </span>
                </div>
                <div className="p-3 bg-[#E2DDD3] rounded-lg text-[#A97C5B]">
                  <ShieldCheck size={24} />
                </div>
              </div>
            </div>

            {/* Active Masterclass Details Banner Card */}
            <div className="bg-[#1c1a17] text-[#f5f2eb] p-6 sm:p-8 rounded-xl border border-[#332f2b] shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-[#A97C5B] text-white">
                    {workshopData.badge}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">ID: {workshopData.id}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold">{workshopData.title}</h2>
                <p className="text-xs text-neutral-300 font-light">{workshopData.subtitle}</p>

                <div className="flex flex-wrap gap-4 text-xs text-neutral-300 pt-2 font-light">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#A97C5B]" /> {workshopData.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#A97C5B]" /> {workshopData.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#A97C5B]" /> {workshopData.venue}</span>
                </div>
              </div>

              <div className="bg-[#2b2723] p-5 rounded-lg border border-[#443e39] text-right space-y-3 w-full lg:w-auto">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">Registration Fee</span>
                  <span className="text-2xl font-serif font-bold text-[#A97C5B]">₹{workshopData.fee.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => setIsEditWorkshopModalOpen(true)}
                  className="w-full px-4 py-2 bg-[#A97C5B] hover:bg-[#966b4c] text-white text-xs uppercase tracking-widest rounded font-medium transition-colors cursor-pointer"
                >
                  Edit Masterclass Details
                </button>
              </div>
            </div>

            {/* Registration List Management Table */}
            <div className="bg-[#faf8f5] border border-[#d8d3c5] rounded-xl overflow-hidden shadow-xs space-y-4">

              {/* Table Header & Search Filter Bar */}
              <div className="p-6 border-b border-[#d8d3c5] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#E2DDD3]/40">
                <div>
                  <h3 className="text-lg font-serif font-semibold text-[#1c1a17]">
                    Participant Registrations ({registrationsList.length})
                  </h3>
                  <p className="text-xs text-neutral-500 font-light">
                    Manage attendee bookings, check-in status, and payment logs.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:flex-initial">
                    <Search size={15} className="absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search token, name, email..."
                      value={regSearchQuery}
                      onChange={(e) => setRegSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 text-xs bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B] w-full sm:w-60"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={regStatusFilter}
                    onChange={(e) => setRegStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="SUCCESSFUL">Successful</option>
                    <option value="PENDING">Pending</option>
                  </select>

                  {/* CSV Export Button */}
                  <button
                    onClick={handleExportRegistrationsCSV}
                    className="px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-700 border border-[#d8d3c5] rounded text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export CSV List"
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Registrations Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E2DDD3] text-[#1c1a17] uppercase tracking-wider font-semibold text-[10px] border-b border-[#d8d3c5]">
                    <tr>
                      <th className="py-3 px-4">Token Number</th>
                      <th className="py-3 px-4">Participant Name</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4 text-center">Seats</th>
                      <th className="py-3 px-4">Paid Amount</th>
                      <th className="py-3 px-4">Payment Status</th>
                      <th className="py-3 px-4 text-center">Studio Check-In</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d8d3c5] text-neutral-700 font-light">
                    {registrationsList
                      .filter((reg) => {
                        const matchesSearch =
                          !regSearchQuery ||
                          reg.tokenNumber.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
                          reg.fullName.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
                          reg.email.toLowerCase().includes(regSearchQuery.toLowerCase());
                        const matchesStatus = regStatusFilter === "All" || reg.paymentStatus === regStatusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((reg) => (
                        <tr key={reg.tokenNumber} className="hover:bg-[#f5f2eb] transition-colors">

                          {/* Token */}
                          <td className="py-4 px-4 font-mono font-bold text-[#1c1a17]">
                            {reg.tokenNumber}
                          </td>

                          {/* Participant Name */}
                          <td className="py-4 px-4 font-semibold text-[#1c1a17]">
                            {reg.fullName}
                            <span className="block text-[10px] text-neutral-500 font-normal">{reg.cityAddress}</span>
                          </td>

                          {/* Contact Info */}
                          <td className="py-4 px-4 space-y-0.5">
                            <div className="text-neutral-800">{reg.email}</div>
                            <div className="text-neutral-500 text-[10px]">{reg.phone}</div>
                          </td>

                          {/* Seats */}
                          <td className="py-4 px-4 text-center font-bold text-[#1c1a17]">
                            {reg.participantCount}
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 font-serif font-bold text-[#1c1a17]">
                            ₹{reg.paidAmount.toLocaleString("en-IN")}
                            <span className="block text-[9px] font-mono text-neutral-400">{reg.paymentMethod}</span>
                          </td>

                          {/* Payment Status */}
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${reg.paymentStatus === "SUCCESSFUL"
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                              }`}>
                              {reg.paymentStatus}
                            </span>
                          </td>

                          {/* Studio Check-In Toggle */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleToggleCheckIn(reg.tokenNumber)}
                              className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${reg.checkedIn
                                  ? "bg-emerald-700 text-white shadow-xs"
                                  : "bg-[#E2DDD3] text-neutral-600 hover:bg-[#d8d3c5]"
                                }`}
                            >
                              {reg.checkedIn ? "✓ Checked In" : "Pending"}
                            </button>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedRegDetail(reg)}
                              className="p-1.5 bg-[#1c1a17] text-white rounded hover:bg-black transition-colors cursor-pointer"
                              title="View Registration Pass Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteRegTarget(reg)}
                              className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                              title="Cancel Registration"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>

                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* PORTFOLIO MANAGEMENT VIEW */
          <>
            {/* Workspace Toolbar: Search & Tab Stats */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e6e2d8] pb-6">

              {/* Category Tabs Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {isLoadingPortfolio ? (
                  <PortfolioCategoryTabsSkeleton />
                ) : (
                  <>
                    <button
                      onClick={() => setActiveCategory("All")}
                      className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-all cursor-pointer whitespace-nowrap ${activeCategory === "All"
                          ? "bg-[#1c1a17] text-[#f5f2eb] font-semibold"
                          : "bg-[#e6e2d8]/60 text-neutral-600 hover:bg-[#e6e2d8] hover:text-black"
                        }`}
                    >
                      All Tabs ({allImagesWithCategory.length})
                    </button>

                    {categories.map((catName) => {
                      const catObj = portfolioData.find((c) => c.category === catName);
                      const count = catObj ? catObj.images.length : 0;
                      const isActive = activeCategory === catName;

                      return (
                        <button
                          key={catName}
                          onClick={() => setActiveCategory(catName)}
                          className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${isActive
                              ? "bg-[#1c1a17] text-[#f5f2eb] font-semibold"
                              : "bg-[#e6e2d8]/60 text-neutral-600 hover:bg-[#e6e2d8] hover:text-black"
                            }`}
                        >
                          <span>{catName}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? "bg-neutral-700 text-white" : "bg-neutral-300 text-neutral-700"}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#faf8f5] border border-[#e6e2d8] rounded focus:outline-none focus:border-[#1c1a17]"
                />
              </div>

            </div>

            {/* Current Active Category Description Bar */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-500">
                Managing: <span className="text-[#1c1a17] font-bold">{activeCategory}</span> ({displayedImages.length} Images Shown)
              </span>
              {hasUnsavedChanges && (
                <span className="text-xs text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded font-medium">
                  You have unsaved changes. Click "Save Changes" to apply live.
                </span>
              )}
            </div>

            {/* Admin Images Grid */}
            {isLoadingPortfolio ? (
              <PortfolioSkeletonGrid />
            ) : displayedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedImages.map((img, idx) => {
                  // Find index within context for reordering
                  const isAllView = activeCategory === "All";
                  const catObj = portfolioData.find((c) => c.category === img.category);
                  const inCatIndex = catObj ? catObj.images.findIndex((i) => i.src === img.src) : -1;

                  const isFirst = isAllView ? idx === 0 : inCatIndex <= 0;
                  const isLast = isAllView
                    ? idx >= displayedImages.length - 1
                    : catObj ? inCatIndex >= catObj.images.length - 1 : true;
                  const displayPos = isAllView ? idx + 1 : inCatIndex + 1;

                  return (
                    <div
                      key={img.id || `${img.category}-${img.src}-${idx}`}
                      className="bg-[#faf8f5] border border-[#e6e2d8] rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                    >
                      {/* Thumbnail Preview - Clickable for Full View */}
                      <div
                        onClick={() => setPreviewImage(img)}
                        className="relative h-56 w-full bg-neutral-200 overflow-hidden cursor-pointer group/thumb"
                      >
                        <Image
                          src={img.src}
                          alt={img.title || "Portfolio Image"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />

                        {/* Tag Badge */}
                        <div className="absolute top-2 left-2 bg-[#1c1a17]/85 text-[#f5f2eb] px-2.5 py-1 rounded text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1 backdrop-blur-xs z-10">
                          <Tag size={10} />
                          {img.category}
                        </div>

                        {/* Quick Full View Hover Overlay */}
                        <div className="absolute inset-0 bg-[#1c1a17]/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white">
                          <Eye size={20} />
                          <span className="text-xs uppercase tracking-widest font-medium">Full View</span>
                        </div>

                        {/* Top Action Overlay Buttons */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                          {/* Edit Button → opens popup dialog */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPortfolioEditModal(img);
                            }}
                            className="p-2 rounded transition-colors shadow-sm cursor-pointer bg-[#1c1a17]/90 text-white hover:bg-black"
                            title="Edit Image"
                          >
                            <Pencil size={14} />
                          </button>

                          {/* Quick Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(img.category, img.src, img.title, img.id);
                            }}
                            className="p-2 bg-red-600/90 text-white rounded hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Image Metadata & Controls Card Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between gap-4">

                        {/* Read-Only Metadata Display with Edit Button */}
                        <div>
                          <div className="flex items-center justify-between group/title">
                            <h3
                              onClick={() => setPreviewImage(img)}
                              className="text-sm font-serif font-semibold uppercase tracking-wider text-[#1c1a17] line-clamp-1 cursor-pointer hover:text-neutral-600 transition-colors"
                            >
                              {img.title || "Untitled Image"}
                            </h3>
                            <button
                              onClick={() => handleOpenPortfolioEditModal(img)}
                              className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                              title="Edit Image"
                            >
                              <Pencil size={12} />
                            </button>
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                            {img.description || "No description provided."}
                          </p>
                        </div>

                        {/* Controls Footer */}
                        <div className="border-t border-[#e6e2d8] pt-3 flex flex-col gap-3">

                          {/* Tag / Category Tab Selector */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold flex items-center gap-1">
                              <Tag size={10} /> Move to Category Tab:
                            </label>
                            <select
                              value={img.category}
                              onChange={(e) => handleTagChange(e.target.value, img.src, img.category, img.id)}
                              className="w-full text-xs bg-[#f5f2eb] border border-[#e6e2d8] rounded px-2.5 py-1.5 focus:outline-none focus:border-[#1c1a17] font-sans font-medium"
                            >
                              {categories.map((cName) => (
                                <option key={cName} value={cName}>
                                  {cName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Re-order & Position Control Bar */}
                          <div className="flex items-center justify-between pt-1 gap-1">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                                Pos #
                              </span>
                              <input
                                type="number"
                                min={1}
                                max={catObj ? catObj.images.length : 1}
                                defaultValue={displayPos}
                                key={`${img.id || img.src}-${displayPos}`}
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val !== displayPos) {
                                    handleSetPosition(img.category, img.src, val, img.id);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.target.blur();
                                  }
                                }}
                                className="w-12 text-center text-xs font-mono font-bold text-[#1c1a17] bg-white border border-[#e6e2d8] rounded py-0.5 focus:outline-none focus:border-[#1c1a17]"
                                title="Type any position number and press Enter to jump directly"
                              />
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleSetPosition(img.category, img.src, 1, img.id)}
                                disabled={isFirst}
                                className={`px-1.5 py-1 text-[9px] font-semibold uppercase tracking-wider rounded border ${isFirst
                                    ? "opacity-30 border-neutral-200 cursor-not-allowed text-neutral-400"
                                    : "border-[#e6e2d8] bg-white hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                                  }`}
                                title="Move directly to Position #1 (Top)"
                              >
                                Top
                              </button>

                              <button
                                onClick={() => handleReorder(img.category, img.src, "up")}
                                disabled={isFirst}
                                className={`p-1.5 rounded border ${isFirst
                                    ? "opacity-30 border-neutral-200 cursor-not-allowed text-neutral-400"
                                    : "border-[#e6e2d8] bg-white hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                                  }`}
                                title="Move Up 1 spot"
                              >
                                <ArrowUp size={13} />
                              </button>

                              <button
                                onClick={() => handleReorder(img.category, img.src, "down")}
                                disabled={isLast}
                                className={`p-1.5 rounded border ${isLast
                                    ? "opacity-30 border-neutral-200 cursor-not-allowed text-neutral-400"
                                    : "border-[#e6e2d8] bg-white hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                                  }`}
                                title="Move Down 1 spot"
                              >
                                <ArrowDown size={13} />
                              </button>

                              <button
                                onClick={() => handleSetPosition(img.category, img.src, catObj ? catObj.images.length : 1, img.id)}
                                disabled={isLast}
                                className={`px-1.5 py-1 text-[9px] font-semibold uppercase tracking-wider rounded border ${isLast
                                    ? "opacity-30 border-neutral-200 cursor-not-allowed text-neutral-400"
                                    : "border-[#e6e2d8] bg-white hover:bg-neutral-100 text-neutral-700 cursor-pointer"
                                  }`}
                                title="Move directly to last position (Bottom)"
                              >
                                End
                              </button>
                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#e6e2d8] rounded-lg bg-[#faf8f5]">
                <ImageIcon size={40} className="text-neutral-300 mb-3" />
                <p className="text-sm uppercase tracking-widest text-neutral-400">No images found in this tab view.</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-[#1c1a17] text-[#f5f2eb] text-xs uppercase tracking-widest rounded font-medium hover:bg-neutral-800 transition-colors"
                >
                  Add First Image
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* FULL VIEW IMAGE PREVIEW MODAL */}
      <AnimatePresence>
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] w-full bg-[#1c1a17] text-[#f5f2eb] rounded-xl overflow-hidden shadow-2xl flex flex-col cursor-default border border-neutral-800"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#25221e]">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[#f5f2eb]/10 text-neutral-300 border border-neutral-700 font-semibold">
                    {previewImage.category}
                  </span>
                  <h2 className="text-sm sm:text-base font-serif uppercase tracking-widest font-semibold text-white">
                    {previewImage.title || "Full View Preview"}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={previewImage.src}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                    title="Open Original Image File"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              {/* Full Image Container */}
              <div className="relative flex-1 min-h-[50vh] max-h-[70vh] w-full bg-neutral-950 flex items-center justify-center p-4">
                <img
                  src={previewImage.src}
                  alt={previewImage.title || "Full View"}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded shadow-lg"
                />
              </div>

              {/* Modal Bottom Metadata */}
              <div className="px-6 py-4 bg-[#25221e] border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
                <p className="line-clamp-2 leading-relaxed">
                  {previewImage.description || "No description specified."}
                </p>
                <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest text-neutral-500 shrink-0">
                  <span>Dim: {previewImage.width || "Auto"} x {previewImage.height || "Auto"} px</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD NEW IMAGE MODAL */}
      <AddPortfolioImageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        defaultCategory={activeCategory !== "All" ? activeCategory : categories[0] || "Advertising"}
        onSuccess={handlePortfolioImagesAdded}
        showToast={showToast}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmTarget && (
          <div
            onClick={() => setDeleteConfirmTarget(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-red-900/10 border-b border-red-200/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full text-red-700">
                    <AlertCircle size={20} />
                  </div>
                  <h2 className="text-sm font-serif uppercase tracking-widest font-bold text-red-950">
                    Confirm Deletion
                  </h2>
                </div>
                <button
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 text-xs text-neutral-700 space-y-3">
                <p className="leading-relaxed">
                  Are you sure you want to remove{" "}
                  <strong className="text-[#1c1a17] font-semibold font-serif uppercase tracking-wide">
                    "{deleteConfirmTarget.imageTitle || "this image"}"
                  </strong>{" "}
                  from <span className="font-semibold text-neutral-900">{deleteConfirmTarget.categoryName}</span>?
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 bg-[#E2DDD3] border-t border-[#d8d3c5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmTarget(null)}
                  className="px-4 py-2 text-xs uppercase tracking-widest rounded border border-neutral-300 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteImage}
                  className="px-5 py-2 text-xs uppercase tracking-widest rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 size={14} />
                  Confirm & Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT PORTFOLIO IMAGE MODAL */}
      <EditPortfolioImageModal
        isOpen={!!portfolioEditModal}
        image={portfolioEditModal}
        categories={categories}
        onClose={() => setPortfolioEditModal(null)}
        onSuccess={handlePortfolioEditSuccess}
        showToast={showToast}
      />

      {/* CREATE / EDIT ARTWORK MODAL */}
      <ArtworkModal
        isOpen={isArtworkModalOpen}
        editingArtwork={editingArtwork}
        onClose={() => setIsArtworkModalOpen(false)}
        onSuccess={handleArtworkSuccess}
        showToast={showToast}
      />

      {/* DELETE ARTWORK CONFIRMATION MODAL */}
      <AnimatePresence>
        {artworkDeleteTarget && (
          <div
            onClick={() => setArtworkDeleteTarget(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-red-900/10 border-b border-red-200/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full text-red-700">
                    <AlertCircle size={20} />
                  </div>
                  <h2 className="text-sm font-serif uppercase tracking-widest font-bold text-red-950">
                    Delete Artwork
                  </h2>
                </div>
                <button
                  onClick={() => setArtworkDeleteTarget(null)}
                  className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 text-xs text-neutral-700 space-y-3">
                <p className="leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-[#1c1a17] font-semibold font-serif uppercase tracking-wide">
                    &quot;{artworkDeleteTarget.title}&quot;
                  </strong>{" "}
                  from the Art Gallery?
                </p>
                <p className="text-[11px] text-neutral-500 font-light">
                  This action will remove the artwork from the gallery catalog immediately.
                </p>
              </div>

              <div className="px-6 py-4 bg-[#E2DDD3] border-t border-[#d8d3c5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setArtworkDeleteTarget(null)}
                  className="px-4 py-2 text-xs uppercase tracking-widest rounded border border-neutral-300 hover:bg-neutral-200 text-neutral-700 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteArtwork}
                  className="px-5 py-2 text-xs uppercase tracking-widest rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 size={14} />
                  Delete Artwork
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT WORKSHOP SETTINGS MODAL */}
      <AnimatePresence>
        {isEditWorkshopModalOpen && (
          <div
            onClick={() => setIsEditWorkshopModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-[#E2DDD3] border-b border-[#d8d3c5]">
                <h2 className="text-base font-serif uppercase tracking-widest font-semibold text-[#1c1a17]">
                  Edit Masterclass Settings
                </h2>
                <button
                  onClick={() => setIsEditWorkshopModalOpen(false)}
                  className="p-1 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveWorkshopDetails} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Masterclass Title</label>
                  <input
                    type="text"
                    value={workshopData.title}
                    onChange={(e) => setWorkshopData({ ...workshopData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Registration Fee (₹)</label>
                    <input
                      type="number"
                      value={workshopData.fee}
                      onChange={(e) => setWorkshopData({ ...workshopData, fee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Available Seats</label>
                    <input
                      type="number"
                      value={workshopData.availableSeats}
                      onChange={(e) => setWorkshopData({ ...workshopData, availableSeats: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Dates</label>
                  <input
                    type="text"
                    value={workshopData.date}
                    onChange={(e) => setWorkshopData({ ...workshopData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Venue Address</label>
                  <input
                    type="text"
                    value={workshopData.venue}
                    onChange={(e) => setWorkshopData({ ...workshopData, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#d8d3c5]">
                  <button
                    type="button"
                    onClick={() => setIsEditWorkshopModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 rounded text-neutral-700 uppercase tracking-widest text-[10px] font-semibold hover:bg-neutral-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#A97C5B] text-white rounded uppercase tracking-widest text-[10px] font-semibold hover:bg-[#966b4c] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD MANUAL REGISTRATION MODAL */}
      <AnimatePresence>
        {isAddRegModalOpen && (
          <div
            onClick={() => setIsAddRegModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-[#E2DDD3] border-b border-[#d8d3c5]">
                <h2 className="text-base font-serif uppercase tracking-widest font-semibold text-[#1c1a17]">
                  Add Manual Offline Registration
                </h2>
                <button
                  onClick={() => setIsAddRegModalOpen(false)}
                  className="p-1 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddManualRegistration} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={manualRegForm.fullName}
                    onChange={(e) => setManualRegForm({ ...manualRegForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@example.com"
                      value={manualRegForm.email}
                      onChange={(e) => setManualRegForm({ ...manualRegForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={manualRegForm.phone}
                      onChange={(e) => setManualRegForm({ ...manualRegForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Number of Seats</label>
                    <select
                      value={manualRegForm.participantCount}
                      onChange={(e) => setManualRegForm({ ...manualRegForm, participantCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                    >
                      <option value={1}>1 Seat (₹{workshopData.fee})</option>
                      <option value={2}>2 Seats (₹{workshopData.fee * 2})</option>
                      <option value={3}>3 Seats (₹{workshopData.fee * 3})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Payment Status</label>
                    <select
                      value={manualRegForm.paymentStatus}
                      onChange={(e) => setManualRegForm({ ...manualRegForm, paymentStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                    >
                      <option value="SUCCESSFUL">SUCCESSFUL</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-neutral-600 mb-1">Camera Gear / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Canon R6 with 85mm"
                    value={manualRegForm.cameraGear}
                    onChange={(e) => setManualRegForm({ ...manualRegForm, cameraGear: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d8d3c5] rounded focus:outline-none focus:border-[#A97C5B]"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[#d8d3c5]">
                  <button
                    type="button"
                    onClick={() => setIsAddRegModalOpen(false)}
                    className="px-4 py-2 border border-neutral-300 rounded text-neutral-700 uppercase tracking-widest text-[10px] font-semibold hover:bg-neutral-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#A97C5B] text-white rounded uppercase tracking-widest text-[10px] font-semibold hover:bg-[#966b4c] cursor-pointer"
                  >
                    Add Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REGISTRATION DETAIL VIEW MODAL */}
      <AnimatePresence>
        {selectedRegDetail && (
          <div
            onClick={() => setSelectedRegDetail(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#faf8f5] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="bg-[#1c1a17] text-[#f5f2eb] px-6 py-4 flex items-center justify-between border-b border-[#A97C5B]">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#A97C5B] tracking-widest block">Attendee Registration Pass</span>
                  <h3 className="text-base font-mono font-bold">{selectedRegDetail.tokenNumber}</h3>
                </div>
                <button onClick={() => setSelectedRegDetail(null)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs text-neutral-700">
                <div className="bg-[#E2DDD3]/50 p-4 rounded border border-[#d8d3c5] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Participant Name:</span>
                    <span className="font-bold text-[#1c1a17]">{selectedRegDetail.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Email:</span>
                    <span className="font-mono text-neutral-800">{selectedRegDetail.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Phone:</span>
                    <span className="font-mono text-neutral-800">{selectedRegDetail.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">City / Address:</span>
                    <span>{selectedRegDetail.cityAddress}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#f5f2eb] rounded border border-[#d8d3c5]">
                    <span className="text-[10px] uppercase text-neutral-500 block">Seats Reserved</span>
                    <span className="text-base font-bold text-[#1c1a17]">{selectedRegDetail.participantCount} Person(s)</span>
                  </div>
                  <div className="p-3 bg-[#f5f2eb] rounded border border-[#d8d3c5]">
                    <span className="text-[10px] uppercase text-neutral-500 block">Total Fee Paid</span>
                    <span className="text-base font-bold text-[#A97C5B]">₹{selectedRegDetail.paidAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="space-y-1 bg-[#f5f2eb] p-3 rounded border border-[#d8d3c5]">
                  <span className="text-[10px] uppercase text-neutral-500 block">Camera &amp; Special Requests</span>
                  <p className="font-medium text-neutral-800">Gear: {selectedRegDetail.cameraGear || "N/A"}</p>
                  <p className="text-neutral-600 font-light">Notes: {selectedRegDetail.specialRequests || "None"}</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-[#E2DDD3] border-t border-[#d8d3c5] flex justify-end">
                <button
                  onClick={() => setSelectedRegDetail(null)}
                  className="px-5 py-2 bg-[#1c1a17] text-white text-xs uppercase tracking-widest rounded font-medium cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CANCEL REGISTRATION CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteRegTarget && (
          <div
            onClick={() => setDeleteRegTarget(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#f5f2eb] border border-[#d8d3c5] rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-red-900/10 border-b border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={20} />
                  <h3 className="font-serif font-bold text-sm uppercase tracking-wider">Cancel Registration</h3>
                </div>
                <button onClick={() => setDeleteRegTarget(null)} className="text-neutral-400 hover:text-black cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 text-xs text-neutral-700 space-y-3">
                <p>
                  Are you sure you want to cancel the registration for{" "}
                  <strong className="text-[#1c1a17] font-bold">{deleteRegTarget.fullName}</strong> ({deleteRegTarget.tokenNumber})?
                </p>
                <p className="text-[11px] text-neutral-500 font-light">
                  This will remove the attendee pass and restore {deleteRegTarget.participantCount || 1} seat(s) back to the available inventory pool.
                </p>
              </div>

              <div className="px-6 py-4 bg-[#E2DDD3] border-t border-[#d8d3c5] flex justify-end gap-3">
                <button
                  onClick={() => setDeleteRegTarget(null)}
                  className="px-4 py-2 border border-neutral-300 rounded text-xs uppercase tracking-widest font-medium cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleDeleteRegistration}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs uppercase tracking-widest font-semibold cursor-pointer"
                >
                  Cancel Registration
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
