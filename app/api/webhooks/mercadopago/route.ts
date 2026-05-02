import { NextResponse } from "next/server";
import { getMercadoPagoPayment } from "@/lib/mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";

const validStatuses = new Set(["pending", "approved", "rejected", "refunded"]);

function getPaymentId(payload: Record<string, unknown>, url: URL) {
  const queryId = url.searchParams.get("data.id") || url.searchParams.get("id");
  const data = payload.data as { id?: string | number } | undefined;
  return String(data?.id || queryId || "");
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const providedSecret = request.headers.get("x-webhook-secret") || url.searchParams.get("secret");

  if (webhookSecret && providedSecret !== webhookSecret) {
    return NextResponse.json({ error: "Invalid webhook secret." }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const paymentId = getPaymentId(payload, url);

  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment id." }, { status: 400 });
  }

  let payment;
  try {
    payment = await getMercadoPagoPayment(paymentId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo validar el pago.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
  const status = validStatuses.has(payment.status) ? payment.status : "pending";
  const amountCents = Math.round(Number(payment.transaction_amount) * 100);
  const supabase = createAdminClient();

  const { data: contribution } = await supabase
    .from("contributions")
    .select("id, gift_id, amount, status, external_reference")
    .eq("external_reference", payment.external_reference)
    .single();

  if (!contribution || contribution.amount !== amountCents) {
    return NextResponse.json({ error: "Payment validation failed." }, { status: 400 });
  }

  const { data: existingEvent } = await supabase
    .from("payment_events")
    .select("id")
    .eq("mp_payment_id", String(payment.id))
    .maybeSingle();

  if (!existingEvent) {
    await supabase.from("payment_events").insert({
      mp_payment_id: String(payment.id),
      contribution_id: contribution.id,
      event_type: String(payload.type || "payment"),
      status,
      raw_payload: { webhook: payload, payment }
    });
  }

  if (contribution.status !== status) {
    await supabase
      .from("contributions")
      .update({
        status,
        mp_payment_id: String(payment.id),
        approved_at: status === "approved" ? new Date().toISOString() : null
      })
      .eq("id", contribution.id);

    if (status === "approved" && contribution.status !== "approved") {
      await supabase.rpc("increment_gift_contribution", {
        gift_id_input: contribution.gift_id,
        amount_input: contribution.amount
      });
    }

    if (status !== "approved" && contribution.status === "approved") {
      await supabase.rpc("increment_gift_contribution", {
        gift_id_input: contribution.gift_id,
        amount_input: -contribution.amount
      });
    }
  }

  return NextResponse.json({ ok: true });
}
