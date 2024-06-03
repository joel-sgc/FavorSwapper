import { Session } from "next-auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";
import { ReactNode } from "react"

export const MiddlewareProvider = ({ session, children }: { session: Session | null, children: ReactNode }) => {
  const headersList = headers();
  const url = headersList.get('x-url');
  const pathname = new URL(url as string).pathname;

  // If not logged in, force redirect to login
  if (!session && pathname !== '/auth/login') {
    redirect('/auth/login');
  }

  // If logged in and trying to access login page, redirect to home
  if (session && pathname === '/auth/login') {
    redirect('/');
  }

  return <>{children}</>
}