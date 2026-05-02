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

function isOpenAmountGift(gift: GiftWithCategory) {
  return gift.gift_categories?.slug === "surprise" || gift.name.toLowerCase().includes("sorpréndenos");
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
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const closeModal = useCallback(() => {
    setSelected(null);
    setLoading(false);
    setError("");
  }, []);
  const closeImagePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);
  useModal(Boolean(selected), closeModal);
  useModal(Boolean(previewImage), closeImagePreview);

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
  const selectedIsOpenAmount = selected ? isOpenAmountGift(selected) : false;
  const selectedImageUrl = selected ? resolveImageUrl(selected.image_url) : null;

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
          const openAmountGift = isOpenAmountGift(gift);
          const progress = gift.is_physical
            ? 0
            : clampProgress(gift.contributed_amount, gift.target_amount);
          const imageUrl = resolveImageUrl(gift.image_url);

          return (
            <article
              key={gift.id}
              className="reveal flex min-h-[360px] flex-col rounded-[1.75rem] border border-charcoal/10 bg-ivory p-5 shadow-soft"
            >
              <button
                type="button"
                className={`mb-5 flex h-44 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-sage/15 via-white to-lavender/15 ${
                  imageUrl ? "cursor-zoom-in" : "cursor-default"
                }`}
                onClick={() => {
                  if (imageUrl) setPreviewImage({ src: imageUrl, alt: gift.name });
                }}
                aria-label={imageUrl ? `Ver imagen de ${gift.name}` : undefined}
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={gift.name}
                    className="h-full w-full object-contain p-2"
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
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sage">
                {gift.gift_categories?.name}
              </p>
              <h3 className="mt-2 font-serif text-4xl leading-none text-charcoal">{gift.name}</h3>
              <p className="mt-3 flex-1 leading-7 text-charcoal/70">{gift.description}</p>
              {gift.is_physical ? (
                <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-charcoal/70">
                  Puedes llevarlo físicamente el día de la boda.
                </p>
              ) : openAmountGift ? (
                <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm text-charcoal/70">
                  <p className="font-semibold text-charcoal">Monto abierto</p>
                  <p>Tú eliges cuánto regalar. Aportado: {formatMoney(gift.contributed_amount)}</p>
                </div>
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

      {previewImage && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-charcoal/70 p-4"
          onClick={closeImagePreview}
        >
          <div
            className="relative w-full max-w-5xl rounded-[2rem] bg-ivory p-3 shadow-soft sm:p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              type="button"
              variant="ghost"
              className="absolute right-4 top-4 z-10 h-11 min-h-11 w-11 bg-ivory/90 px-0 shadow-soft"
              onClick={closeImagePreview}
            >
              <X size={20} />
            </Button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage.src}
              alt={previewImage.alt}
              className="max-h-[82vh] w-full rounded-[1.5rem] object-contain"
            />
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-end bg-charcoal/45 p-4 sm:place-items-center"
          onClick={closeModal}
        >
          <form
            action={checkout}
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-ivory p-5 shadow-soft sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="order-2 flex min-h-72 rounded-[1.5rem] bg-gradient-to-br from-sage/15 via-white to-lavender/15 p-3 lg:order-1 lg:sticky lg:top-0 lg:h-full">
                {selectedImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedImageUrl}
                    alt={selected.name}
                    className="max-h-[68vh] w-full rounded-[1.15rem] object-contain"
                  />
                ) : (
                  <div className="flex min-h-72 w-full items-center justify-center rounded-[1.15rem] bg-white/50">
                    <HeartHandshake className="text-lavender" size={48} />
                  </div>
                )}
              </div>

              <div className="order-1 lg:order-2">
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
                      defaultValue={
                        selectedIsOpenAmount
                          ? 500
                          : Math.min(
                              Math.max(500, (selected.target_amount - selected.contributed_amount) / 100),
                              selected.target_amount / 100
                            )
                      }
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
              </div>
            </div>
          </form>
        </div>
      )}
    </Section>
  );
}
