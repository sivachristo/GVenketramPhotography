import { getContactData } from "@/lib/getContactData";
import ContactContent from "@/components/ContactContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Contact | G Venket Ram Photography",
  description:
    "Get in touch with G Venket Ram Photography for commercial bookings, advertising campaigns, and fine art inquiries.",
};

export default async function ContactPage() {
  const contactData = await getContactData();
  return <ContactContent initialData={contactData} />;
}

