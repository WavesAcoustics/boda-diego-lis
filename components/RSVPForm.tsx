"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

type State = "idle" | "loading" | "success" | "error";

export function RSVPForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(formData: FormData) {
    setState("loading");
    setMessage("");

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        companions: 0,
        dietary_restrictions: formData.get("dietary_restrictions"),
        will_attend: formData.get("will_attend") === "yes"
      })
    });

    const payload = await response.json().catch(() => ({}));
    setState(response.ok ? "success" : "error");
    setMessage(
      response.ok
        ? "Confirmación enviada correctamente"
        : payload.error || "No pudimos guardar tu respuesta. Intenta de nuevo."
    );
  }

  return (
    <Section id="rsvp" eyebrow="RSVP" title="Confírmanos si nos acompañas.">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <p className="reveal max-w-md text-lg leading-8 text-charcoal/72">
          Tu respuesta nos ayuda a cuidar cada detalle: mesa, cena, brindis y atenciones
          especiales. Gracias por hacerlo con tiempo.
        </p>
        <form
          action={onSubmit}
          className="reveal grid gap-4 rounded-[2rem] border border-charcoal/10 bg-white/70 p-5 shadow-soft sm:p-8"
        >
          <label className="grid gap-2 text-sm font-semibold">
            Nombre completo
            <input
              name="name"
              required
              className="min-h-12 rounded-2xl border border-charcoal/15 bg-ivory px-4 outline-none focus:border-sage"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Restricciones alimenticias
            <textarea
              name="dietary_restrictions"
              rows={3}
              className="rounded-2xl border border-charcoal/15 bg-ivory p-4 outline-none focus:border-sage"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-charcoal/15 bg-ivory px-4">
              <input type="radio" name="will_attend" value="yes" required />
              Sí asistiré
            </label>
            <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-charcoal/15 bg-ivory px-4">
              <input type="radio" name="will_attend" value="no" required />
              No podré asistir
            </label>
          </div>
          <Button disabled={state === "loading"} className="mt-2 gap-2">
            {state === "loading" ? "Guardando..." : "Enviar confirmación"} <Send size={17} />
          </Button>
          {state === "success" && (
            <p className="text-sm font-semibold text-sage">{message}</p>
          )}
          {state === "error" && (
            <p className="text-sm font-semibold text-lavender">
              {message}
            </p>
          )}
        </form>
      </div>
    </Section>
  );
}
