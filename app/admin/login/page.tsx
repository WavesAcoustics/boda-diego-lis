import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-ivory px-5">
      <section className="w-full max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sage">Admin</p>
        <h1 className="mt-3 font-serif text-6xl leading-none text-charcoal">Diego & Lis</h1>
        <p className="mb-8 mt-4 leading-7 text-charcoal/70">
          Panel privado para RSVPs, regalos y aportaciones.
        </p>
        {params.error === "unauthorized" && (
          <p className="mb-4 rounded-2xl bg-lavender/15 p-4 text-sm font-semibold text-charcoal">
            Tu usuario existe, pero no está autorizado como admin.
          </p>
        )}
        <LoginForm />
      </section>
    </main>
  );
}
