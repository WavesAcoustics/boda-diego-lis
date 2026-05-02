"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import type { GiftCategory, GiftWithCategory } from "@/lib/types";

export function GiftManager({
  gifts,
  categories
}: {
  gifts: GiftWithCategory[];
  categories: GiftCategory[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function createGift(formData: FormData) {
    setLoading(true);
    await fetch("/api/admin/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category_id: formData.get("category_id"),
        name: formData.get("name"),
        description: formData.get("description"),
        target_amount: Number(formData.get("target_amount")) * 100,
        is_physical: formData.get("is_physical") === "on"
      })
    });
    setLoading(false);
    router.refresh();
  }

  async function deleteGift(id: string) {
    await fetch(`/api/admin/gifts?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function updateGift(formData: FormData) {
    await fetch("/api/admin/gifts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: formData.get("id"),
        category_id: formData.get("category_id"),
        name: formData.get("name"),
        description: formData.get("description"),
        target_amount: Number(formData.get("target_amount")) * 100,
        is_physical: formData.get("is_physical") === "on"
      })
    });
    router.refresh();
  }

  return (
    <section className="grid gap-6">
      <form action={createGift} className="grid gap-3 rounded-[1.5rem] bg-white p-5 shadow-soft lg:grid-cols-5">
        <select name="category_id" required className="min-h-12 rounded-2xl border border-charcoal/15 bg-ivory px-4 lg:col-span-1">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input name="name" required placeholder="Nombre" className="min-h-12 rounded-2xl border border-charcoal/15 bg-ivory px-4 lg:col-span-1" />
        <input name="description" required placeholder="Descripción" className="min-h-12 rounded-2xl border border-charcoal/15 bg-ivory px-4 lg:col-span-1" />
        <input name="target_amount" type="number" min="1" required placeholder="Meta MXN" className="min-h-12 rounded-2xl border border-charcoal/15 bg-ivory px-4 lg:col-span-1" />
        <div className="flex gap-3">
          <label className="flex items-center gap-2 rounded-2xl bg-ivory px-3 text-sm">
            <input name="is_physical" type="checkbox" />
            Físico
          </label>
          <Button disabled={loading} className="gap-2 px-4">
            <Plus size={17} /> Crear
          </Button>
        </div>
      </form>

      <div className="grid gap-3">
        {gifts.map((gift) => (
          <form
            key={gift.id}
            action={updateGift}
            className="grid gap-3 rounded-[1.25rem] bg-white p-4 shadow-sm xl:grid-cols-[1fr_1fr_1fr_120px_auto_auto] xl:items-center"
          >
            <input type="hidden" name="id" value={gift.id} />
            <select name="category_id" defaultValue={gift.category_id} className="min-h-11 rounded-2xl border border-charcoal/15 bg-ivory px-3 text-sm">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input name="name" defaultValue={gift.name} className="min-h-11 rounded-2xl border border-charcoal/15 bg-ivory px-3 text-sm" />
            <input name="description" defaultValue={gift.description} className="min-h-11 rounded-2xl border border-charcoal/15 bg-ivory px-3 text-sm" />
            <input
              name="target_amount"
              type="number"
              min="1"
              defaultValue={gift.target_amount / 100}
              className="min-h-11 rounded-2xl border border-charcoal/15 bg-ivory px-3 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input name="is_physical" type="checkbox" defaultChecked={gift.is_physical} />
              Físico
            </label>
            <div className="flex items-center gap-2">
              <span className="min-w-28 text-xs font-semibold text-charcoal/60">
                {gift.is_physical
                  ? "Físico"
                  : `${formatMoney(gift.contributed_amount)} recaudado`}
              </span>
              <Button className="min-h-10 px-4" type="submit">
                Guardar
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 min-h-10 w-10 px-0"
                onClick={() => deleteGift(gift.id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
