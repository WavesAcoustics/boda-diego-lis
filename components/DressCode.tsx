import Image from "next/image";
import { Section } from "@/components/ui/Section";

const colors = ["#7C8F61", "#A57CA6", "#EFE6D8", "#F8F3EA", "#B5965B", "#252321"];

export function DressCode() {
  return (
    <Section
      id="dress-code"
      eyebrow="Dress code"
      title="SEMI FORMAL GARDEN PARTY"
      className="bg-white/45"
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="reveal overflow-hidden rounded-[2rem] border border-charcoal/10 bg-ivory shadow-soft">
          <Image
            src="/images/dress-code-garden-party.png"
            alt="Referencia visual de dress code semi formal garden party"
            width={1122}
            height={1402}
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="reveal rounded-[2rem] border border-charcoal/10 bg-ivory/90 p-6 shadow-soft sm:p-8">
          <p className="font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
            Fresco, elegante y relajado, ideal para celebrar al aire libre.
          </p>
          <div className="mt-7 grid gap-5 leading-8 text-charcoal/72">
            <p>
              Te invitamos a vestir en un estilo garden party, tomando en cuenta que en
              septiembre en CDMX la temperatura va entre los 12 °C y 22 °C.
            </p>
            <p>
              Para ellas, sugerimos vestidos fluidos en telas ligeras, con colores suaves o
              estampados florales, en largos midi o largos.
            </p>
            <p>
              Para ellos, trajes o conjuntos en tonos claros o naturales, combinados con camisas
              frescas; la corbata es opcional.
            </p>
            <p className="font-serif text-3xl leading-tight text-lavender">
              O como te sientas más sensual.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {colors.map((color) => (
              <span
                key={color}
                className="h-11 w-11 rounded-full border border-charcoal/10 shadow-sm"
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
