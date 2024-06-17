"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { usePathname, useRouter } from "next/navigation";
import { serverRevalidate } from "@/lib/server-actions";
import { ReactNode, useEffect } from "react";
import PullToRefresh from "pulltorefreshjs";
import { Session } from "next-auth";

export const MiddlewareProvider = ({ session, children, ...props }: { session: Session | null, children: ReactNode } & ThemeProviderProps ) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches

    function iOS() {
      return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ].includes(navigator?.userAgentData?.platform ?? navigator?.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }

    if (iOS()) {
      document.querySelectorAll('.favor-form-drawer').forEach((el) => {
        // el.style.bottom = ''
      })
    }
    

    if (standalone && iOS()) {
      PullToRefresh.init({
        onRefresh() {
          serverRevalidate('/', 'layout');
        },
      })
    }
  }, [])


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