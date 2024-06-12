"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";
import { ReactNode } from "react";

export const MiddlewareProvider = ({ session, children, ...props }: { session: Session | null, children: ReactNode } & ThemeProviderProps ) => {
  const pathname = usePathname();
  const router = useRouter();

  // If not logged in, force redirect to login
  if (!session && pathname !== '/auth/login') {
    router.replace('/auth/login');
  }

  // If logged in and trying to access login page, redirect to home
  if (session && pathname === '/auth/login') {
    router.replace('/');
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}