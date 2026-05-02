import { Section } from "@/components/ui/Section";

export function Story() {
  return (
    <Section eyebrow="Nuestra historia" title="Lo simple también puede cambiarlo todo.">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <p className="reveal font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
          Nos encontramos sin demasiada ceremonia, pero con esa claridad rara de las cosas que
          empiezan pequeñas y de pronto se vuelven casa.
        </p>
        <p className="reveal text-lg leading-8 text-charcoal/70">
          Esta boda no busca ser perfecta. Busca ser nuestra: una tarde bonita, una mesa llena,
          la gente que queremos cerca y la promesa de seguir eligiéndonos en lo cotidiano.
        </p>
      </div>
    </Section>
  );
}
