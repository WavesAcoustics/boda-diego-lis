import { DressCode } from "@/components/DressCode";
import { DogDonation } from "@/components/DogDonation";
import { ConfigNotice } from "@/components/ConfigNotice";
import { Footer } from "@/components/Footer";
import { GiftRegistry } from "@/components/GiftRegistry";
import { Hero } from "@/components/Hero";
import { InfoSection } from "@/components/InfoSection";
import { Nav } from "@/components/Nav";
import { RSVPForm } from "@/components/RSVPForm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Timeline } from "@/components/Timeline";
import { demoCategories, demoGifts } from "@/lib/demo-data";
import { getMissingSupabasePublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { GiftCategory, GiftWithCategory } from "@/lib/types";

async function getRegistry() {
  const missing = getMissingSupabasePublicEnv();
  if (missing.length) {
    return {
      categories: demoCategories,
      gifts: demoGifts,
      warning: `Modo demo: faltan variables de Supabase (${missing.join(", ")}). RSVP, pagos y admin requieren .env.local.`
    };
  }

  const supabase = await createClient();
  const [{ data: categories, error: categoriesError }, { data: gifts, error: giftsError }] = await Promise.all([
    supabase.from("gift_categories").select("*").order("sort_order"),
    supabase
      .from("gifts")
      .select("*, gift_categories(*)")
      .eq("is_active", true)
      .order("sort_order")
  ]);

  if (categoriesError || giftsError) {
    return {
      categories: demoCategories,
      gifts: demoGifts,
      warning: `Modo demo: Supabase no devolvió regalos reales (${categoriesError?.message || giftsError?.message}).`
    };
  }

  return {
    categories: (categories as GiftCategory[] | null) || demoCategories,
    gifts: (gifts as GiftWithCategory[] | null) || demoGifts,
    warning: null
  };
}

export default async function Home() {
  const { categories, gifts, warning } = await getRegistry();

  return (
    <main>
      <ConfigNotice message={warning} />
      <ScrollReveal />
      <Nav />
      <Hero />
      <InfoSection />
      <Timeline />
      <DressCode />
      <RSVPForm />
      <GiftRegistry categories={categories} gifts={gifts} />
      <DogDonation gifts={gifts} />
      <Footer />
    </main>
  );
}
