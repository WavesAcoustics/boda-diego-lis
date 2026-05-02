import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminRoute } from "@/lib/auth-route";
import { createAdminClient } from "@/lib/supabase/admin";

const createSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().trim().min(2).max(140),
  description: z.string().trim().min(4).max(500),
  target_amount: z.number().int().min(1),
  is_physical: z.boolean().default(false)
});

const updateSchema = createSchema.partial().extend({
  id: z.string().uuid()
});

export async function POST(request: Request) {
  const auth = await requireAdminRoute();
  if ("error" in auth) return auth.error;

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("gifts").insert(parsed.data);

  if (error) {
    return NextResponse.json({ error: "No se pudo crear el regalo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const auth = await requireAdminRoute();
  if ("error" in auth) return auth.error;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta id." }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("gifts").update({ is_active: false }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "No se pudo desactivar el regalo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const auth = await requireAdminRoute();
  if ("error" in auth) return auth.error;

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const { id, ...changes } = parsed.data;
  const supabase = createAdminClient();
  const { error } = await supabase.from("gifts").update(changes).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "No se pudo actualizar el regalo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
