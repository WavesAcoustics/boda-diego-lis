import { createClient } from "@supabase/supabase-js";
import { envError, getMissingSupabaseAdminEnv } from "@/lib/env";

export function createAdminClient() {
  const missing = getMissingSupabaseAdminEnv();
  if (missing.length) {
    throw new Error(envError("Supabase admin no está configurado.", missing));
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return createClient(url!, serviceKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
