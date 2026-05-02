"use client";

import { createBrowserClient } from "@supabase/ssr";
import { envError, getMissingSupabasePublicEnv } from "@/lib/env";

export function createClient() {
  const missing = getMissingSupabasePublicEnv();
  if (missing.length) {
    throw new Error(envError("Supabase público no está configurado.", missing));
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
