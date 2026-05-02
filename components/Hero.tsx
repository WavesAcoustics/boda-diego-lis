import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { wedding } from "@/lib/wedding";

export function Hero() {
  return (
    <>
      <section id="inicio" className="relative min-h-screen overflow-hidden bg-charcoal text-ivory">
        <Image
          src="/images/portada-boda.png"
          alt="Ilustración editorial de Diego y Lis"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(37,35,33,0.28)_68%,rgba(37,35,33,0.72)_100%)]" />
        <div className="relative z-10 flex min-h-screen items-end px-5 pb-16 pt-32 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <div className="reveal max-w-3xl">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-ivory/85">
                Nos casamos
              </p>
              <h1 className="font-serif text-7xl leading-[0.86] drop-shadow-sm sm:text-8xl lg:text-[9.5rem]">
                Diego
                <span className="block">& Lis</span>
              </h1>
              <div className="mt-8 flex flex-col gap-3 text-sm text-ivory/95 sm:flex-row sm:items-center sm:gap-6">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={18} /> {wedding.date}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={18} /> Coyoacán, CDMX
                </span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#rsvp" variant="secondary" className="hover:bg-white">
                  Confirmar asistencia
                </ButtonLink>
                <ButtonLink
                  href="#regalos"
                  variant="secondary"
                  className="bg-white/10 uppercase tracking-[0.2em] text-ivory ring-white/35 hover:bg-white/20"
                >
                  La mesa
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 border-y border-charcoal/10 py-12 lg:grid-cols-2">
          <blockquote className="reveal">
            <p className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
              “Tú y yo, es como si nos hubieran enseñado a besarnos en el cielo y nos hubieran
              enviado juntos a la tierra, para ver si sabemos lo que nos enseñaron”.
            </p>
            <footer className="mt-5 text-sm uppercase tracking-[0.22em] text-sage">
              Doctor Zhivago, Borís Pasternak
            </footer>
          </blockquote>
          <blockquote className="reveal">
            <p className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
              “Sea lo que sea de lo que estén hechas nuestras almas, la tuya y la mía están hechas
              de lo mismo”.
            </p>
            <footer className="mt-5 text-sm uppercase tracking-[0.22em] text-lavender">
              Cumbres Borrascosas, Emily Brontë
            </footer>
          </blockquote>
        </div>
      </section>
    </>
  );
}
