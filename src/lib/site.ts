import heroChair from "@/assets/hero-chair.jpg";
import catChurch from "@/assets/cat-church.jpg";
import catClassroom from "@/assets/cat-classroom.jpg";
import catOffice from "@/assets/cat-office.jpg";
import catLounge from "@/assets/cat-lounge.jpg";
import catEvent from "@/assets/cat-event.jpg";
import workshop from "@/assets/workshop.jpg";

// Map seeded asset paths -> bundled URLs.
const assetMap: Record<string, string> = {
  "/assets/hero-chair.jpg": heroChair,
  "/assets/cat-church.jpg": catChurch,
  "/assets/cat-classroom.jpg": catClassroom,
  "/assets/cat-office.jpg": catOffice,
  "/assets/cat-lounge.jpg": catLounge,
  "/assets/cat-event.jpg": catEvent,
  "/assets/workshop.jpg": workshop,
};

export function resolveImage(src: string | null | undefined): string {
  if (!src) return heroChair;
  if (assetMap[src]) return assetMap[src];
  return src; // already a full URL
}

export const WHATSAPP_URL = "https://wa.link/ry602k";

export function whatsappEnquiry(productName?: string) {
  // wa.link is a static short URL; we can't prefill that one. Fall back to wa.me with the phone number.
  const phone = "2348034328344";
  const msg = productName
    ? `Hello Imadu Global Concepts, I'm interested in the ${productName}. Please provide more information.`
    : `Hello Imadu Global Concepts, I'd like to make an enquiry.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

export const COMPANY = {
  name: "Imadu Global Concepts",
  address: "Km 10, Sagamu-Abeokuta Express Way, Siun Town",
  phone: "+234-803-432-8344",
  email: "imadu.richard@gmail.com",
  whatsapp: WHATSAPP_URL,
  facebook: "https://www.facebook.com/p/Imadu-Global-Concepts-100063592442873/",
  instagram: "https://www.instagram.com/imadurichard/",
  tiktok: "https://www.tiktok.com/@imaduglobalchairs",
};
