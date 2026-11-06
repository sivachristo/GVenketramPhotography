import { Cormorant_Garamond, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { SettingsProvider } from "@/context/SettingsContext";
import ProductionHostGuard from "@/components/ProductionHostGuard";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "G Venket Ram Photography | Premium Portfolio & Art Gallery",
  description: "High-end fashion, jewellery, art, advertising photography, and fine art prints by G Venket Ram Photography.",
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const host = headersList.get("host")?.split(":")[0]?.toLowerCase() || "";

  // Check if current hostname is the live domain
  const isProduction = host === "gvenketram.in" || host === "www.gvenketram.in";

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#f5f2eb] text-[#1c1a17] selection:bg-[#1c1a17] selection:text-[#f5f2eb] font-sans"
        suppressHydrationWarning
      >
        <SettingsProvider>
          <ProductionHostGuard isProduction={isProduction}>
            <CartProvider>
              <Navbar />
              <main className="flex-grow flex flex-col">
                {children}
              </main>
              <Footer />
              <CartDrawer />
            </CartProvider>
          </ProductionHostGuard>
        </SettingsProvider>
      </body>
    </html>
  );
}
