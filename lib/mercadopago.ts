import { absoluteUrl } from "@/lib/format";
import { envError, getMissingMercadoPagoEnv } from "@/lib/env";

type PreferencePayload = {
  external_reference: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    quantity: number;
    unit_price: number;
    currency_id: "MXN";
  }>;
  payer: {
    name: string;
    email: string;
  };
  back_urls: {
    success: string;
    pending: string;
    failure: string;
  };
  notification_url: string;
  auto_return?: "approved";
};

export async function createMercadoPagoPreference(payload: PreferencePayload) {
  const missing = getMissingMercadoPagoEnv();
  if (missing.length) {
    throw new Error(envError("MercadoPago no está configurado.", missing));
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token!}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("MercadoPago preference failed", body);
    throw new Error(
      "MercadoPago rechazó la creación del pago. Revisa que MERCADOPAGO_ACCESS_TOKEN sea el Access Token privado, no la Public Key."
    );
  }

  return response.json() as Promise<{ id: string; init_point: string; sandbox_init_point?: string }>;
}

export async function getMercadoPagoPayment(paymentId: string) {
  const missing = getMissingMercadoPagoEnv();
  if (missing.length) {
    throw new Error(envError("MercadoPago no está configurado.", missing));
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token!}` },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("MercadoPago payment lookup failed", body);
    throw new Error(
      "MercadoPago no permitió validar el pago. Revisa el Access Token configurado."
    );
  }

  return response.json() as Promise<{
    id: number;
    status: "pending" | "approved" | "rejected" | "refunded" | string;
    external_reference: string;
    transaction_amount: number;
  }>;
}

export function buildPreferenceInput(input: {
  contributionId: string;
  giftId: string;
  giftName: string;
  giftDescription: string;
  contributorName: string;
  contributorEmail: string;
  amountCents: number;
}) {
  const amount = input.amountCents / 100;

  const preference: PreferencePayload = {
    external_reference: input.contributionId,
    items: [
      {
        id: input.giftId,
        title: input.giftName,
        description: input.giftDescription,
        quantity: 1,
        unit_price: amount,
        currency_id: "MXN" as const
      }
    ],
    payer: {
      name: input.contributorName,
      email: input.contributorEmail
    },
    back_urls: {
      success: absoluteUrl("/regalos/gracias?status=approved"),
      pending: absoluteUrl("/regalos/gracias?status=pending"),
      failure: absoluteUrl("/regalos/gracias?status=rejected")
    },
    notification_url: absoluteUrl("/api/webhooks/mercadopago")
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const isLocalUrl = siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");

  if (!isLocalUrl) {
    preference.auto_return = "approved";
  }

  return preference;
}
