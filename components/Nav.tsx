import { ButtonLink } from "@/components/ui/Button";

const links = [
  ["Inicio", "#inicio"],
  ["Cuándo y dónde", "#informacion"],
  ["Itinerario", "#itinerario"],
  ["Dress code", "#dress-code"],
  ["RSVP", "#rsvp"],
  ["La mesa", "#regalos"],
  ["Perritos", "#perritos"]
];

export function Nav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 px-4 py-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/70 px-4 py-2 shadow-soft">
        <a href="#inicio" className="font-serif text-2xl text-charcoal">
          D & L
        </a>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-sm text-charcoal/75 transition hover:bg-white/70 hover:text-charcoal"
            >
              {label}
            </a>
          ))}
        </div>
        <ButtonLink href="#regalos" className="min-h-10 px-4 text-xs uppercase tracking-[0.16em]">
          La mesa
        </ButtonLink>
      </nav>
    </header>
  );
}
