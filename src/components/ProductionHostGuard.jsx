"use client";

import { usePathname } from "next/navigation";
import UnderConstructionView from "@/components/UnderConstructionView";

export default function ProductionHostGuard({ isProduction, children }) {
  const pathname = usePathname();

  // If we are on gvenketram.in or www.gvenketram.in:
  // - Admin panel (/admin) remains accessible
  // - Internal APIs (/api) remain accessible
  // - All public-facing pages show the Under Construction screen
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/api");

  if (isProduction && !isAdmin) {
    return <UnderConstructionView />;
  }

  // Otherwise (localhost, preview URLs, etc.): show the normal website
  return children;
}

