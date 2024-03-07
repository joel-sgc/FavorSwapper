'use client'

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { SessionProvider } from "next-auth/react";

export const Provider = ({children, ...props}: ThemeProviderProps) => (
  <SessionProvider>
    <NextThemesProvider {...props}>{children}</NextThemesProvider>
  </SessionProvider>
)