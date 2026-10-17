import { getAboutData } from "@/lib/getAboutData";
import AboutContent from "@/components/AboutContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "About | G Venket Ram Photography",
  description:
    "Learn about G Venket Ram, internationally acclaimed fashion photographer and visual director based in Chennai, India.",
};

export default async function AboutPage() {
  const aboutData = await getAboutData();
  return <AboutContent initialData={aboutData} />;
}
