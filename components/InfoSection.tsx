import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { wedding } from "@/lib/wedding";

export function InfoSection() {
  return (
    <Section id="informacion" eyebrow="Información" title="Cuándo y dónde">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="reveal overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white/70 shadow-soft">
          <Image
            src="/images/convento-coyoacan.png"
            alt="Acuarela del Convento de Coyoacán"
            width={1122}
            height={1402}
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="grid gap-6">
          <article className="reveal rounded-[2rem] border border-charcoal/10 bg-white/75 p-6 shadow-soft sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sage">Misa</p>
            <p className="mt-4 font-serif text-3xl leading-tight text-charcoal">
              El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni
              orgulloso. No se comporta con rudeza, no es egoísta, no se enoja fácilmente, no
              guarda rencor.
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-charcoal/50">
              Corintios 13
            </p>
            <p className="mt-6 leading-8 text-charcoal/72">
              La hermosa parroquia de Coyoacán tiene un lugar especial en nuestros corazones, y
              nos da mucha felicidad poder compartirlo con ustedes.
            </p>
            <ButtonLink
              href={wedding.misaMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 gap-2"
            >
              Abrir misa en Google Maps <ExternalLink size={17} />
            </ButtonLink>
          </article>

          <article className="reveal rounded-[2rem] border border-charcoal/10 bg-ivory p-6 shadow-soft sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lavender">
              Recepción
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.22em] text-charcoal/50">
              {wedding.date} · Coyoacán, CDMX
            </p>
            <p className="mt-6 leading-8 text-charcoal/72">
              El magno evento será en El Convento de Coyoacán. Está a 5 minutos caminando de la
              iglesia para que no se preocupen por el traslado. Recomendamos no traer coche, pero
              hay servicio de valet parking en cualquier caso.
            </p>
            <ButtonLink
              href={wedding.receptionMapsUrl}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
              className="mt-6 gap-2"
            >
              Abrir recepción en Google Maps <ExternalLink size={17} />
            </ButtonLink>
          </article>
        </div>
      </div>
    </Section>
  );
}
