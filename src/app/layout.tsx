import { Header } from "@/components/nav/header";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import { auth } from "@/auth";
import { MiddlewareProvider } from "@/components/middleware-provider";
import { Footer } from "@/components/nav/footer";
import { Toaster } from "@/components/ui/sonner";
 
const roboto = Roboto({
  variable: "--roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true
}

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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen flex flex-col bg-background font-roboto antialiased",
        roboto.variable
      )}>
        {/* Header and Footer handled in Middleware Provider */}
        <MiddlewareProvider 
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          session={session}
        >
          {session && <Header session={session}/>}
          {children}
          {session && <Footer session={session}/>}
        </MiddlewareProvider>
        <Toaster richColors/>
      </body>
    </html>
  );
}
