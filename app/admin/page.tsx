import Link from "next/link";
import { Download } from "lucide-react";
import { GiftManager } from "@/components/admin/GiftManager";
import { ButtonLink } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import type { AdminContribution, GiftCategory, GiftWithCategory, Guest } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();

  const [{ data: guests }, { data: contributions }, { data: gifts }, { data: categories }] =
    await Promise.all([
      supabase.from("guests").select("*").order("created_at", { ascending: false }),
      supabase
        .from("contributions")
        .select("*, gifts(name)")
        .order("created_at", { ascending: false }),
      supabase
        .from("gifts")
        .select("*, gift_categories(*)")
        .order("sort_order", { ascending: true }),
      supabase.from("gift_categories").select("*").order("sort_order", { ascending: true })
    ]);

  const adminGuests = (guests || []) as Guest[];
  const adminContributions = (contributions || []) as AdminContribution[];
  const adminGifts = (gifts || []) as GiftWithCategory[];
  const adminCategories = (categories || []) as GiftCategory[];
  const approved = adminContributions.filter((item) => item.status === "approved");
  const total = approved.reduce((sum, item) => sum + item.amount, 0);
  const completed = adminGifts.filter(
    (gift) => !gift.is_physical && gift.contributed_amount >= gift.target_amount
  ).length;

  return (
    <main className="min-h-screen bg-ivory px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-charcoal/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sage">Dashboard</p>
            <h1 className="mt-2 font-serif text-6xl leading-none text-charcoal">Admin Diego & Lis</h1>
          </div>
          <div className="flex gap-3">
            <ButtonLink href="/api/admin/export" className="gap-2">
              <Download size={17} /> Exportar CSV
            </ButtonLink>
            <form action="/api/auth/signout" method="post">
              <button className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-charcoal">
                Salir
              </button>
            </form>
            <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-charcoal">
              Ver sitio
            </Link>
          </div>
        </header>

        <section className="grid gap-4 py-8 md:grid-cols-4">
          {[
            ["RSVPs", String(adminGuests.length)],
            ["Total recaudado", formatMoney(total)],
            ["Aportaciones", String(adminContributions.length)],
            ["Regalos completos", String(completed)]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.5rem] bg-white p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/45">{label}</p>
              <p className="mt-3 font-serif text-4xl text-charcoal">{value}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[1.5rem] bg-white p-5 shadow-soft">
            <h2 className="font-serif text-4xl">RSVPs</h2>
            <div className="mt-5 grid gap-3">
              {adminGuests.map((guest) => (
                <article key={guest.id} className="border-t border-charcoal/10 py-3">
                  <div className="flex justify-between gap-4">
                    <p className="font-semibold">{guest.name}</p>
                    <p className={guest.will_attend ? "text-sage" : "text-lavender"}>
                      {guest.will_attend ? "Asiste" : "No asiste"}
                    </p>
                  </div>
                  <p className="text-sm text-charcoal/65">
                    Acompañantes: {guest.companions}
                    {guest.dietary_restrictions ? ` · ${guest.dietary_restrictions}` : ""}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[1.5rem] bg-white p-5 shadow-soft">
            <h2 className="font-serif text-4xl">Aportaciones y mensajes</h2>
            <div className="mt-5 grid gap-3">
              {adminContributions.map((item) => (
                <article key={item.id} className="border-t border-charcoal/10 py-3">
                  <div className="flex justify-between gap-4">
                    <p className="font-semibold">{item.contributor_name}</p>
                    <p className="font-semibold">{formatMoney(item.amount)}</p>
                  </div>
                  <p className="text-sm text-charcoal/65">
                    {item.gifts?.name} · {item.status} · {item.contributor_email}
                  </p>
                  {item.message && <p className="mt-2 text-sm italic text-charcoal/70">“{item.message}”</p>}
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="py-8">
          <h2 className="mb-5 font-serif text-4xl">CRUD de regalos</h2>
          <GiftManager gifts={adminGifts} categories={adminCategories} />
        </section>
      </div>
    </main>
  );
}
