import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function requireAdminRoute() {
  let supabase;

  try {
    supabase = await createClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Supabase no está configurado.";
    return { error: NextResponse.json({ error: message }, { status: 500 }) };
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { supabase, user };
}
