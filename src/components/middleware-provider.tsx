"use client"

import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";
import { ReactNode } from "react";

export const MiddlewareProvider = ({ session, children }: { session: Session | null, children: ReactNode }) => {
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

  return <>{children}</>
}