import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const copy = {
  approved: {
    icon: CheckCircle2,
    title: "Gracias por tu regalo.",
    text: "MercadoPago nos avisará la confirmación final y actualizaremos la mesa de regalos."
  },
  pending: {
    icon: Clock,
    title: "Tu pago está pendiente.",
    text: "Cuando MercadoPago lo apruebe, quedará registrado automáticamente."
  },
  rejected: {
    icon: XCircle,
    title: "El pago no se completó.",
    text: "Puedes volver a intentarlo desde la mesa de regalos."
  }
};

export default async function ThanksPage({
  searchParams
}: {
  searchParams: Promise<{ status?: keyof typeof copy }>;
}) {
  const params = await searchParams;
  const status = params.status && copy[params.status] ? params.status : "pending";
  const item = copy[status];
  const Icon = item.icon;

  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-5">
      <section className="max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-soft">
        <Icon className="mx-auto text-sage" size={44} />
        <h1 className="mt-6 font-serif text-5xl text-charcoal">{item.title}</h1>
        <p className="mt-4 leading-7 text-charcoal/70">{item.text}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/#regalos">Volver a regalos</ButtonLink>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-charcoal"
          >
            Inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
