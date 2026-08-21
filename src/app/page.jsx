import Gallery from "@/components/Gallery";
import HeroScrollLink from "@/components/HeroScrollLink";
import { getPortfolioData } from "@/lib/getPortfolioData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { categories, portfolioData } = await getPortfolioData();

  // Flatten all images and tag them with their category
  const allImages = portfolioData.flatMap((cat) =>
    cat.images.map((img) => ({
      ...img,
      category: cat.category,
    }))
  );

  // Categories list including "All" as default filter
  const galleryCategories = ["All", ...categories];

  return (
    <div className="min-h-screen bg-[#f5f2eb]">
      {/* Full-Screen Premium Hero Banner */}
      <div className="relative h-screen w-full flex overflow-hidden">
        {/* Background Image with warm editorial tone */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[10%] brightness-[0.85]"
          style={{
            backgroundImage: `url('/fashion_portrait_hero.png')`
          }}
        />
        {/* Subtle full-bleed overlay to ensure off-white text readability */}
        <div className="absolute inset-0 bg-neutral-950/30" />

        {/* View Portfolio Button at the Bottom Center */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <HeroScrollLink />
        </div>
      </div>

      {/* Main Curated Gallery Section (Tightly following the Hero) */}
      <div id="portfolio" className="w-full px-4 sm:px-8 lg:px-12 py-16 scroll-mt-6">
        {/* Gallery System */}
        <Gallery
          categories={galleryCategories}
          allImages={allImages}
          initialCategory="All"
        />
      </div>
    </div>
  );
}
