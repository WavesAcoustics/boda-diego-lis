import { Section } from "@/components/ui/Section";

const events = [
  ["5:00 PM", "Misa", "Ceremonia religiosa para iniciar la celebración."],
  ["6:30 PM", "Cóctel de bienvenida", "Un primer brindis para encontrarnos con calma."],
  ["7:00 PM", "Recepción", "Llegada a El Convento de Coyoacán."],
  ["8:00 PM", "Cena", "Una mesa cálida para compartir y celebrar."],
  ["10:00 PM", "El bailongo", "Música, brindis y pista abierta."]
];

export function Timeline() {
  return (
    <Section id="itinerario" eyebrow="Itinerario" title="Una tarde que se vuelve noche.">
      <div className="reveal mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <p className="text-sm font-semibold uppercase leading-7 tracking-[0.24em] text-sage">
          Si estás leyendo esto, es porque te queremos mucho y te esperamos con mucho cariño.
        </p>
        <blockquote>
          <p className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
            “No es quien te roba el corazón, sino quien te hace sentir que lo tienes de vuelta”.
          </p>
          <footer className="mt-4 text-sm uppercase tracking-[0.2em] text-lavender">
            Veinte poemas de amor y una canción desesperada, Pablo Neruda
          </footer>
        </blockquote>
      </div>

      <div className="relative rounded-[2rem] border border-charcoal/10 bg-white/60 p-5 shadow-soft sm:p-8">
        <div className="absolute bottom-8 left-9 top-8 w-px bg-gradient-to-b from-sage/10 via-sage/55 to-lavender/25 sm:left-16" />
        <div className="grid gap-1">
          {events.map(([time, title, description], index) => (
            <article
              key={title}
              className="reveal relative grid gap-2 py-6 pl-12 sm:grid-cols-[150px_1fr] sm:gap-8 sm:pl-20"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="absolute left-[0.6rem] top-9 h-5 w-5 rounded-full border border-sage/40 bg-ivory shadow-[0_0_0_8px_rgba(248,243,234,0.95)] sm:left-[1.55rem]" />
              <div className="font-serif text-3xl leading-none text-lavender sm:text-4xl">{time}</div>
              <div>
                <h3 className="font-serif text-3xl leading-none text-charcoal sm:text-4xl">
                  {title}
                </h3>
                <p className="mt-2 max-w-xl leading-7 text-charcoal/70">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
