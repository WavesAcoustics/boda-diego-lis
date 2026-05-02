const placeholderValues = new Set([
  "",
  "https://your-project.supabase.co",
  "your_anon_key",
  "your_service_role_key",
  "APP_USR_or_TEST_access_token"
]);

export function isConfigured(value: string | undefined) {
  return Boolean(value && !placeholderValues.has(value));
}

export function getMissingSupabaseAdminEnv() {
  const missing: string[] = [];
  if (!isConfigured(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!isConfigured(process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  return missing;
}

export function getMissingSupabasePublicEnv() {
  const missing: string[] = [];
  if (!isConfigured(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!isConfigured(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return missing;
}

export function getMissingMercadoPagoEnv() {
  return isConfigured(process.env.MERCADOPAGO_ACCESS_TOKEN)
    ? []
    : ["MERCADOPAGO_ACCESS_TOKEN"];
}

export function envError(message: string, missing: string[]) {
  return `${message} Falta configurar: ${missing.join(", ")}.`;
}
