import { wedding } from "@/lib/wedding";

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 px-5 py-10 text-center text-sm text-charcoal/60">
      <p className="font-serif text-3xl text-charcoal">Diego & Lis</p>
      <p className="mt-2">{wedding.date} · Hecho con cariño.</p>
    </footer>
  );
}
