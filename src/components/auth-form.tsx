"use server"
import { auth, signIn, signOut } from "@/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Provider = 'google' | 'nodemailer'

export const AuthForm = async ({ provider, className, ...props }: { className?: string, provider: Provider }) => {
  const session = await auth();

  return (
    <form
      className={cn("flex flex-col gap-2", className)}
      action={async (form) => {
        "use server"
        if (session) {
          await signOut();
        } else {
          await signIn(provider, { email: form.get('email') });
        }
      }}
      {...props}
    >

      <Input type="email" name="email" placeholder="johndoe@email.com" autoComplete="email" required={(provider === 'nodemailer' && !session)} className={(provider === 'google' || session) ? 'hidden' : ''}/>
      <Button type="submit">
        {session ? 'Sign Out' : (
          provider === 'google' ? 'Sign In with Google' : 'Sign In with Email'
      )}</Button>
    </form>
  )
}

export const SignOutForm = ({ className, children, ...props }: { className?: string, children?: ReactNode }) => (
  <form action={async () => {
    "use server"
    await signOut();
  }}>
    <Button type="submit" className={className} {...props}>
      {children}
    </Button>
  </form>
)