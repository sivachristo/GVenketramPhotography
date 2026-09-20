"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext(null);

const SETTINGS_STORAGE_KEY = "gvenketram_site_settings";

const DEFAULT_SETTINGS = {
  visibility: {
    artGallery: true,
    workshop: true,
  },
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial settings from localStorage and/or API
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({
          ...prev,
          ...parsed,
          visibility: {
            ...prev.visibility,
            ...(parsed.visibility || {}),
          },
        }));
      }
    } catch (err) {
      console.error("Failed to load settings from localStorage:", err);
    }

    // Attempt to sync from backend API if available
    fetch("/api/settings")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.settings) {
          setSettings((prev) => {
            const merged = {
              ...prev,
              ...data.settings,
              visibility: {
                ...prev.visibility,
                ...(data.settings.visibility || {}),
              },
            };
            try {
              localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {
              // ignore
            }
            return merged;
          });
        }
      })
      .catch((err) => {
        // Silently fallback to localStorage / defaults if API is unavailable
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  // Save settings helper
  const updateVisibility = (moduleKey, isVisible) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        visibility: {
          ...prev.visibility,
          [moduleKey]: Boolean(isVisible),
        },
      };

      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save settings to localStorage:", err);
      }

      // Also trigger backend update (non-blocking)
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updated }),
      }).catch((e) => console.log("Settings API sync note:", e));

      return updated;
    });
  };

  const isArtGalleryEnabled = settings?.visibility?.artGallery ?? true;
  const isWorkshopEnabled = settings?.visibility?.workshop ?? true;

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoaded,
        updateVisibility,
        isArtGalleryEnabled,
        isWorkshopEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
