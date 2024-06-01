import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils"
import "./globals.css";

import type { Metadata } from "next";
 
const roboto = Roboto({
  variable: "--roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DACS Favor Swapper",
  description: "Ofibodegas ofrece espacios de oficina y almacenamiento flexibles y seguros para empresas. Personaliza tu espacio según tus necesidades. ¡Contáctanos hoy para más información!",
  icons: {
    icon: [
      {
        url: '/logo.svg',
        href: '/logo.svg',
      },
    ]
  },
  openGraph: {
    type: 'website',
    url: process.env.BASE_URL,
    title: 'DACS Favor Swapper',
    description: 'Ofibodegas ofrece espacios de oficina y almacenamiento flexibles y seguros para empresas. Personaliza tu espacio según tus necesidades. ¡Contáctanos hoy para más información!',
    siteName: 'DACS Favor Swapper',
    images: [{url: `${process.env.BASE_URL}/og.webp`}],
  },
  twitter: {
    card: 'summary_large_image',
    images: `${process.env.BASE_URL}/og.webp`,
    title: 'DACS Favor Swapper',
    description: 'Ofibodegas ofrece espacios de oficina y almacenamiento flexibles y seguros para empresas. Personaliza tu espacio según tus necesidades. ¡Contáctanos hoy para más información!',
  },
  metadataBase: new URL(process.env.BASE_URL as string),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        roboto.variable
      )}>
        {children}
      </body>
    </html>
  );
}
