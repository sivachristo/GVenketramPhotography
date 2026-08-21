import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Gallery from "@/components/Gallery";
import { getPortfolioCategories, getPortfolioImages } from "@/lib/getPortfolioData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const categories = await getPortfolioCategories();
  return categories.map((cat) => ({
    category: cat.toLowerCase(),
  }));
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const categoryParam = resolvedParams.category;

  const categories = await getPortfolioCategories();

  // Match category case-insensitively from Supabase category list
  const matchedCategory = categories.find(
    (cat) => cat.toLowerCase() === categoryParam.toLowerCase()
  );

  if (!matchedCategory) {
    notFound();
  }

  // Fetch database records ONLY for the requested category from Supabase
  const categoryImages = await getPortfolioImages(matchedCategory);

  // Find other collections to display in footer navigation
  const otherCollections = categories.filter(
    (cat) => cat.toLowerCase() !== categoryParam.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#f5f2eb] px-4 sm:px-8 lg:px-12 py-16 text-[#1c1a17]">
      <div className="w-full">
        
        {/* Back Link and Navigation Header */}
        <div className="mb-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e6e2d8] pb-8">
          <div>
            <Link
              href="/"
              className="group inline-flex items-center text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors duration-300 mb-4"
            >
              <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Portfolios
            </Link>
            <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-widest text-[#1c1a17] font-serif">
              {matchedCategory} <span className="font-semibold text-neutral-500 font-serif">Collection</span>
            </h1>
          </div>
          <span className="text-xs text-neutral-400 tracking-wider">
            {categoryImages.length} Curated Images
          </span>
        </div>

        {/* Pre-Filtered Gallery Component */}
        <div className="mb-24">
          <Gallery
            categories={[matchedCategory]}
            allImages={categoryImages}
            initialCategory={matchedCategory}
          />
        </div>

        {/* Footer Navigation deck to explore other categories */}
        <div className="border-t border-[#e6e2d8] pt-16 mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block mb-6 text-center">
            Explore Other Collections
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 max-w-4xl mx-auto text-xs uppercase tracking-[0.2em]">
            {otherCollections.map((cat) => (
              <Link
                key={cat}
                href={`/portfolio/${cat.toLowerCase()}`}
                className="text-neutral-500 hover:text-black transition-colors duration-300 flex items-center group font-semibold"
              >
                <span>{cat}</span>
                <ChevronRight size={12} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
