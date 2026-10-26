import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const LOCAL_STORAGE_FILE = path.join(process.cwd(), "src", "data", "about.json");

export const DEFAULT_ABOUT_DATA = {
  subtitle: "",
  titlePrefix: "",
  titleHighlight: "G. VENKET RAM",
  bioParagraph1: `Known for his mastery in creating magic with light, every one of Venket Ram's meticulously crafted images, is a work of art.

Light & form come together beautifully to create arresting visuals – be it high fashion with great models or a humble ladle in the kitchen.

Venket Ram has worked for all the leading brands in India.

He has worked with celebrated personalities from various fields including films, sports, politics & academics, from the early days of his career for various ads & editorials. Mr Sachin Tendulkar, Mr M S Dhoni, Mr Sivaji Ganesan, Mr Amitabh Bachchan and honorable Prime Minister, Mr Narendra Modi, to name a few.

He has carved a niche for himself in the genre of movie promos too. His meticulously planned movie shoots - be it in spectacular locales or painstakingly put-together sets - his much-talked-about images have been instrumental in creating an anticipatory buzz before the movie release.
Over the years, he's shot for more than 300 movies.

He has inspired & mentored many young minds through workshops and lectures.`,
  quote: "While he enjoys commercial photography, he also excels in capturing images that touch his heart.",
  bioParagraph2: `He has showcased such images in a couple of exhibitions - Thanjavur, an exhibition of black and white photographs on Chola temples at Alliance Francaise, Chennai and Kitchart, an exhibition of fine art photography in Art Houz Chennai were among the notable ones.

Kodak India chose him to shoot for the Kodak 2002 calendar, considering him to be one of the leading ad-photographers in South India.

Venket Ram used celebrated actors alongside vintage cars for his Calendar 2011– each shot, planned to bring out the timeless beauty of the cars and the magnetic personality of the stars in the same frame…

His 2012 calendar featured 12 dazzling divas from the film industry in their stylish, elegant best and created quite a stir…

Calendar 2013 by Venket Ram had a spectacular jungle theme, in which the images were as breathtaking as any classical painting.

In 2020, he recreated 12 iconic paintings of the legendary artist Raja Ravi Varma, in a calendar for NAAM, an NGO for destitute women in Chennai. He used famous personalities from the film and art world to portray the beautiful women in Raja Ravi Varma's paintings. This calendar brought him critical acclaim, not just in India, but in many international publications too.

Despite his busy stint as an advertising photographer he has always made time to experiment with various fashion themes – ‘Bare’ – a fine art nude series in 2023 and in his latest collection of images – ‘Nostalgia’ – a fond remembrance and a recreation of a family photograph taken in the 1920’s.

He looks forward to many more years of exploring the ever-changing light through his camera.`,
  publicationsTitle: "Select Clients & Publications",
  publications: [
    "Vogue Italia",
    "Harper's Bazaar",
    "GQ Magazine",
    "Vanity Fair",
    "The New York Times",
    "AD Magazine"
  ],
  imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  imageAlt: "G. Venket Ram Portrait",
  updatedAt: new Date().toISOString()
};

export function getLocalAboutData() {
  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      return { ...DEFAULT_ABOUT_DATA, ...parsed };
    }
  } catch (err) {
    console.error("Error reading local about.json:", err);
  }
  return DEFAULT_ABOUT_DATA;
}

export function writeLocalAboutData(data) {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to local about.json:", err);
  }
}

export async function getAboutData() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data?.settings?.about) {
        return {
          ...DEFAULT_ABOUT_DATA,
          ...data.settings.about,
          source: "supabase",
        };
      }
    }
  } catch (err) {
    console.warn("Supabase GET about data notice:", err.message);
  }

  const local = getLocalAboutData();
  return { ...local, source: "local" };
}
