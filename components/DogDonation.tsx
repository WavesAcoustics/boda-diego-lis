"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { useModal } from "@/lib/use-modal";
import type { GiftWithCategory } from "@/lib/types";

const petSlugs = new Set(["perritos", "donativo-a-perritos"]);

export function DogDonation({ gifts }: { gifts: GiftWithCategory[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const donationGift = useMemo(
    () =>
      gifts.find((gift) => {
        const slug = gift.gift_categories?.slug || "";
        return !gift.is_physical && (petSlugs.has(slug) || gift.name.toLowerCase().includes("perrit"));
      }) || null,
    [gifts]
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setLoading(false);
    setError("");
  }, []);
  useModal(isOpen, closeModal);

  async function checkout(formData: FormData) {
    if (!donationGift) return;
    setLoading(true);
    setError("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gift_id: donationGift.id,
        contributor_name: formData.get("contributor_name"),
        contributor_email: formData.get("contributor_email"),
        amount: Number(formData.get("amount")),
        message: formData.get("message")
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      setLoading(false);
      setError(payload.error || "No pudimos iniciar el donativo.");
      return;
    }

    window.location.href = payload.init_point;
  }

  return (
    <Section
      id="perritos"
      eyebrow="Perritos"
      title="Un cachito de amor para ellos"
      className="bg-ivory"
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="reveal rounded-[2rem] border border-charcoal/10 bg-white/70 p-6 shadow-soft sm:p-8">
          <p className="text-sm font-semibold uppercase leading-7 tracking-[0.22em] text-sage">
            Queremos agradecerle a Dios, al universo, a la vida todo el amor que nos brinda y
            repartir un cachito de ese amor a la causa que más nos gusta: los animales callejeros.
          </p>
          <div className="mt-7 grid gap-5 text-lg leading-8 text-charcoal/72">
            <p>
              Si está en tus posibilidades traer un donativo para ellos, se recomienda comida o
              juguetitos.
            </p>
            <p>
              Todo lo recaudado será entregado a 31 gatitos y a unas señoras que rescatan
              perritos.
            </p>
          </div>
          {donationGift ? (
            <Button className="mt-8 w-full sm:w-auto" onClick={() => setIsOpen(true)}>
              Hacer donativo
            </Button>
          ) : (
            <p className="mt-8 rounded-2xl bg-ivory px-4 py-3 text-sm font-semibold text-lavender">
              Para activar el donativo en línea, agrega en Supabase un regalo activo de la
              categoría perritos.
            </p>
          )}
        </div>

        <div className="reveal overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white shadow-soft">
          <Image
            src="/images/perritos-donativo.png"
            alt="Acuarela de perritos para donativo"
            width={1128}
            height={1394}
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="h-auto w-full object-cover"
          />
        </div>
      </div>

      {isOpen && donationGift && (
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
                  Donativo
                </p>
                <h3 className="mt-2 font-serif text-5xl leading-none text-charcoal">
                  {donationGift.name}
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
                <input
                  name="contributor_name"
                  required
                  className="min-h-12 rounded-2xl border border-charcoal/15 bg-white px-4 outline-none focus:border-sage"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Tu email
                <input
                  name="contributor_email"
                  type="email"
                  required
                  className="min-h-12 rounded-2xl border border-charcoal/15 bg-white px-4 outline-none focus:border-sage"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Monto en MXN
                <input
                  name="amount"
                  type="number"
                  min="50"
                  step="10"
                  defaultValue="500"
                  required
                  className="min-h-12 rounded-2xl border border-charcoal/15 bg-white px-4 outline-none focus:border-sage"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Mensaje personalizado
                <textarea
                  name="message"
                  rows={3}
                  className="rounded-2xl border border-charcoal/15 bg-white p-4 outline-none focus:border-sage"
                />
              </label>
            </div>
            {error && <p className="mt-4 text-sm font-semibold text-lavender">{error}</p>}
            <Button className="mt-6 w-full" disabled={loading}>
              {loading ? "Abriendo donativo..." : "Continuar a pago"}
            </Button>
          </form>
        </div>
      )}
    </Section>
  );
}
