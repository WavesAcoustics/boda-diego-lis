import { NextResponse } from "next/server";
import { z } from "zod";
import { buildPreferenceInput, createMercadoPagoPreference } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  gift_id: z.string().uuid(),
  contributor_name: z.string().trim().min(2).max(160),
  contributor_email: z.string().trim().email().max(180),
  amount: z.number().min(50).max(250000),
  message: z.string().trim().max(800).optional().nullable()
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "La solicitud de regalo llegó vacía." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    return NextResponse.json(
      { error: `Datos inválidos para el regalo${fields ? `: ${fields}` : ""}.` },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const amountCents = Math.round(input.amount * 100);
  let supabase;

  try {
    supabase = createAdminClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supabase no está configurado.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data: gift, error: giftError } = await supabase
    .from("gifts")
    .select("id, name, description, target_amount, contributed_amount, is_active, is_physical")
    .eq("id", input.gift_id)
    .single();

  if (giftError || !gift || !gift.is_active) {
    return NextResponse.json({ error: "Regalo no disponible." }, { status: 404 });
  }

  const remaining = Math.max(0, gift.target_amount - gift.contributed_amount);
  if (remaining <= 0) {
    return NextResponse.json({ error: "Este regalo ya está completo." }, { status: 400 });
  }

  if (amountCents > remaining && remaining > 0) {
    return NextResponse.json(
      { error: `La aportación supera el monto restante de este regalo.` },
      { status: 400 }
    );
  }

  const { data: contribution, error: contributionError } = await supabase
    .from("contributions")
    .insert({
      gift_id: input.gift_id,
      contributor_name: input.contributor_name,
      contributor_email: input.contributor_email,
      message: input.message || null,
      amount: amountCents,
      status: "pending",
      external_reference: crypto.randomUUID()
    })
    .select("id, external_reference")
    .single();

  if (contributionError || !contribution) {
    return NextResponse.json({ error: "No se pudo preparar el regalo." }, { status: 500 });
  }

  try {
    const preference = await createMercadoPagoPreference(
      buildPreferenceInput({
        contributionId: contribution.external_reference,
        giftId: gift.id,
        giftName: gift.name,
        giftDescription: gift.description,
        contributorName: input.contributor_name,
        contributorEmail: input.contributor_email,
        amountCents
      })
    );

    await supabase
      .from("contributions")
      .update({ mp_preference_id: preference.id })
      .eq("id", contribution.id);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const shouldUseSandbox =
      siteUrl.includes("localhost") ||
      siteUrl.includes("127.0.0.1") ||
      process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith("TEST-");

    return NextResponse.json({
      init_point: shouldUseSandbox
        ? preference.sandbox_init_point || preference.init_point
        : preference.init_point || preference.sandbox_init_point
    });
  } catch (error) {
    await supabase
      .from("contributions")
      .update({ status: "rejected" })
      .eq("id", contribution.id);

    const message = error instanceof Error ? error.message : "MercadoPago no respondió correctamente.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
