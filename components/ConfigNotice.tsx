export function ConfigNotice({ message }: { message: string | null }) {
  if (!message || process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-lavender/30 bg-ivory p-4 text-sm font-semibold text-charcoal shadow-soft md:left-auto md:max-w-xl">
      {message}
    </div>
  );
}
