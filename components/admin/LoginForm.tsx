"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(formData: FormData) {
    setLoading(true);
    setError("");

    let authError: { message: string } | null = null;

    try {
      const supabase = createClient();
      const result = await supabase.auth.signInWithPassword({
        email: String(formData.get("email")),
        password: String(formData.get("password"))
      });
      authError = result.error;
    } catch (error) {
      authError = { message: error instanceof Error ? error.message : "Supabase no está configurado." };
    }

    setLoading(false);

    if (authError) {
      setError(authError.message || "No pudimos iniciar sesión.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form action={login} className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-soft">
      <label className="grid gap-2 text-sm font-semibold">
        Email
        <input
          name="email"
          type="email"
          required
          className="min-h-12 rounded-2xl border border-charcoal/15 bg-ivory px-4 outline-none focus:border-sage"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Contraseña
        <input
          name="password"
          type="password"
          required
          className="min-h-12 rounded-2xl border border-charcoal/15 bg-ivory px-4 outline-none focus:border-sage"
        />
      </label>
      {error && <p className="text-sm font-semibold text-lavender">{error}</p>}
      <Button disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
    </form>
  );
}
