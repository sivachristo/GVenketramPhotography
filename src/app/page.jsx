import UnderConstructionPage from "@/app/under-construction/page";

// Note: To restore the full portfolio later, replace the export below with the OriginalPortfolio component.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "G Venket Ram Photography | Coming Soon",
  description: "High-end fashion, jewellery, art, and advertising photography by G Venket Ram Photography.",
};

export default function Home() {
  return <UnderConstructionPage />;
}

/*
// ============================================================================
// ORIGINAL PORTFOLIO CODE (Preserved for easy restoration when ready)
// ============================================================================
import Gallery from "@/components/Gallery";
import HeroScrollLink from "@/components/HeroScrollLink";
import HeroBackgroundSlider from "@/components/HeroBackgroundSlider";
import { getPortfolioData } from "@/lib/getPortfolioData";
import { getMainImages } from "@/lib/getMainImages";

export async function OriginalPortfolio() {
  const [{ categories, portfolioData }, mainImages] = await Promise.all([
    getPortfolioData(),
    getMainImages(true),
  ]);

  const allImages = portfolioData.flatMap((cat) =>
    cat.images.map((img) => ({
      ...img,
      category: cat.category,
    }))
  );

  const galleryCategories = categories.includes("All")
    ? categories
    : ["All", ...categories];

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      <div className="relative h-screen w-full flex overflow-hidden">
        <HeroBackgroundSlider images={mainImages} />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <HeroScrollLink />
        </div>
      </div>

      <div id="portfolio" className="w-full px-4 sm:px-8 lg:px-12 py-16 scroll-mt-6">
        <Gallery
          categories={galleryCategories}
          allImages={allImages}
          initialCategory="All"
        />
      </div>
    </div>
  );
}
*/
