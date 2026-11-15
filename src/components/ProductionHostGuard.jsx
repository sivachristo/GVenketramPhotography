"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import UnderConstructionView from "@/components/UnderConstructionView";

export default function ProductionHostGuard({ isProduction = false, children }) {
  const pathname = usePathname();
  const [isProdHost, setIsProdHost] = useState(isProduction);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname.toLowerCase();
      setIsProdHost(host === "gvenketram.in" || host === "www.gvenketram.in");
    }
  }, []);

  // If we are on gvenketram.in or www.gvenketram.in:
  // - Admin panel (/admin) remains accessible
  // - Internal APIs (/api) remain accessible
  // - All public-facing pages show the Under Construction screen
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/api");

  if (isProdHost && !isAdmin) {
    return <UnderConstructionView />;
  }

  // Otherwise (localhost, preview URLs, etc.): show the normal website
  return children;
}


