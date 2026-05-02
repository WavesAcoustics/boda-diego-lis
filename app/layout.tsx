import type { Metadata } from "next";
import "./globals.css";

const title = "Diego & Lis | 12 de septiembre de 2026";
const description =
  "Nos casamos en Coyoacán y queremos compartir este día con ustedes. Confirma tu asistencia, consulta la ubicación, dress code y nuestra mesa.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lisydiego.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://www.lisydiego.com",
    siteName: "Diego & Lis",
    images: [
      {
        url: "/images/portada-boda.png",
        width: 1200,
        height: 630,
        alt: "Diego y Lis - Boda en Coyoacán"
      }
    ],
    locale: "es_MX",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/portada-boda.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
