import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diego & Lis | Boda",
  description: "Landing de boda, RSVP y mesa de regalos de Diego & Lis.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Diego & Lis",
    description: "Nos casamos. Confirma tu asistencia y acompáñanos en esta nueva etapa.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
