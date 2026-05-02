"use client";

import { Gift, HeartHandshake, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { clampProgress, formatMoney } from "@/lib/format";
import type { GiftCategory, GiftWithCategory } from "@/lib/types";
import { useModal } from "@/lib/use-modal";

const petCategorySlugs = new Set(["perritos", "juguetes", "donativo-a-perritos"]);
const hiddenGiftNames = new Set(["fondo para documentos y trámites"]);

function resolveImageUrl(url: string | null) {
  if (!url) return null;

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch?.[1]) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w900`;
  }

  return url;
}

export function GiftRegistry({
  categories,
  gifts
}: {
  categories: GiftCategory[];
  gifts: GiftWithCategory[];
}) {
  const [category, setCategory] = useState("todos");
  const [selected, setSelected] = useState<GiftWithCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const closeModal = useCallback(() => {
    setSelected(null);
    setLoading(false);
    setError("");
  }, []);
  useModal(Boolean(selected), closeModal);

  const registryGifts = useMemo(
    () =>
      gifts.filter((gift) => {
        const slug = gift.gift_categories?.slug || "";
        const name = gift.name.toLowerCase();
        return !petCategorySlugs.has(slug) && !hiddenGiftNames.has(name);
      }),
    [gifts]
  );

  const activeCategories = useMemo(() => {
    const slugsWithGifts = new Set(
      registryGifts.map((gift) => gift.gift_categories?.slug).filter(Boolean)
    );
    return categories.filter((item) => slugsWithGifts.has(item.slug));
  }, [categories, registryGifts]);

  const filtered = useMemo(() => {
    if (category === "todos") return registryGifts;
    return registryGifts.filter((gift) => gift.gift_categories?.slug === category);
  }, [category, registryGifts]);

  async function checkout(formData: FormData) {
    if (!selected) return;
    setLoading(true);
    setError("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gift_id: selected.id,
        contributor_name: formData.get("contributor_name"),
        contributor_email: formData.get("contributor_email"),
        amount: Number(formData.get("amount")),
        message: formData.get("message")
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      setLoading(false);
      setError(payload.error || "No pudimos iniciar el pago.");
      return;
    }

    window.location.href = payload.init_point;
  }

  return (
    <Section
      id="regalos"
      eyebrow="Mesa de regalos"
      title="La mesa"
      className="bg-white/45"
    >
      <p className="reveal mb-8 max-w-2xl leading-8 text-charcoal/70">
        Si quieren acompañarnos con un regalo, aquí pueden hacerlo de forma sencilla. Cada
        aportación se suma con cariño a esta nueva etapa.
      </p>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCategory("todos")}
          className={`min-h-11 whitespace-nowrap rounded-full px-5 text-sm font-semibold ${
            category === "todos" ? "bg-charcoal text-ivory" : "bg-ivory text-charcoal"
          }`}
        >
          Todos
        </button>
        {activeCategories.map((item) => (
          <button
            key={item.id}
            onClick={() => setCategory(item.slug)}
            className={`min-h-11 whitespace-nowrap rounded-full px-5 text-sm font-semibold ${
              category === item.slug ? "bg-charcoal text-ivory" : "bg-ivory text-charcoal"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((gift) => {
          const progress = gift.is_physical
            ? 0
            : clampProgress(gift.contributed_amount, gift.target_amount);
          const imageUrl = resolveImageUrl(gift.image_url);

          return (
            <article
              key={gift.id}
              className="reveal flex min-h-[360px] flex-col rounded-[1.75rem] border border-charcoal/10 bg-ivory p-5 shadow-soft"
            >
              <div className="mb-5 flex h-36 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-sage/25 via-white to-lavender/25">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={gift.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    {gift.is_physical ? (
                      <Gift className="text-sage" size={42} />
                    ) : (
                      <HeartHandshake className="text-lavender" size={42} />
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">
                {gift.gift_categories?.name}
              </p>
              <h3 className="mt-2 font-serif text-4xl leading-none text-charcoal">{gift.name}</h3>
              <p className="mt-3 flex-1 leading-7 text-charcoal/70">{gift.description}</p>
              {gift.is_physical ? (
                <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-charcoal/70">
                  Puedes llevarlo físicamente el día de la boda.
                </p>
              ) : (
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{formatMoney(gift.contributed_amount)}</span>
                    <span>{formatMoney(gift.target_amount)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-charcoal/10">
                    <div className="h-full rounded-full bg-sage" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
              <Button
                className="mt-5 w-full"
                onClick={() => {
                  setError("");
                  setLoading(false);
                  setSelected(gift);
                }}
                disabled={gift.is_physical}
              >
                {gift.is_physical ? "Llevar juguete físico" : "Regalar"}
              </Button>
            </article>
          );
        })}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-end bg-charcoal/45 p-4 sm:place-items-center"
          onClick={closeModal}
        >
          <form
            action={checkout}
            className="w-full max-w-xl rounded-[2rem] bg-ivory p-6 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sage">
                  Regalar
                </p>
                <h3 className="mt-2 font-serif text-5xl leading-none text-charcoal">
                  {selected.name}
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="h-11 min-h-11 w-11 px-0"
                onClick={closeModal}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                Tu nombre
                <input name="contributor_name" required className="min-h-12 rounded-2xl border border-charcoal/15 bg-white px-4 outline-none focus:border-sage" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Tu email
                <input name="contributor_email" type="email" required className="min-h-12 rounded-2xl border border-charcoal/15 bg-white px-4 outline-none focus:border-sage" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Monto en MXN
                <input
                  name="amount"
                  type="number"
                  min="50"
                  step="10"
                  defaultValue={Math.min(
                    Math.max(500, (selected.target_amount - selected.contributed_amount) / 100),
                    selected.target_amount / 100
                  )}
                  required
                  className="min-h-12 rounded-2xl border border-charcoal/15 bg-white px-4 outline-none focus:border-sage"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Mensaje personalizado
                <textarea name="message" rows={3} className="rounded-2xl border border-charcoal/15 bg-white p-4 outline-none focus:border-sage" />
              </label>
            </div>
            {error && <p className="mt-4 text-sm font-semibold text-lavender">{error}</p>}
            {error && (
              <Button type="button" variant="secondary" className="mt-3 w-full" onClick={closeModal}>
                Volver a regalos
              </Button>
            )}
            <Button className="mt-6 w-full" disabled={loading}>
              {loading ? "Abriendo pago..." : "Continuar a pago"}
            </Button>
          </form>
        </div>
      )}
    </Section>
  );
}
