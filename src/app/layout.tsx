import { Roboto } from "next/font/google";
import { Header } from "@/components/nav";
import { cn } from "@/lib/utils";
import "./globals.css";

import type { Metadata } from "next";
 
const roboto = Roboto({
  variable: "--roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DACS Favor Swapper",
  description: "Join DACS Favor Swapper! Connect with friends, join favor groups, and earn daily points through check-ins and ads. Turn everyday tasks into rewarding quests. Start swapping favors now!",
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
    description: 'Join DACS Favor Swapper! Connect with friends, join favor groups, and earn daily points through check-ins and ads. Turn everyday tasks into rewarding quests. Start swapping favors now!',
    siteName: 'DACS Favor Swapper',
    images: [{url: `${process.env.BASE_URL}/og.webp`}],
  },
  twitter: {
    card: 'summary_large_image',
    images: `${process.env.BASE_URL}/og.webp`,
    title: 'DACS Favor Swapper',
    description: 'Join DACS Favor Swapper! Connect with friends, join favor groups, and earn daily points through check-ins and ads. Turn everyday tasks into rewarding quests. Start swapping favors now!',
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
        "min-h-screen flex flex-col bg-background font-sans antialiased",
        roboto.variable
      )}>
        <Header />
        {children}
      </body>
    </html>
  );
}
