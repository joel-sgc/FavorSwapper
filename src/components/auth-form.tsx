import { auth, signIn, signOut } from "@/auth"
import { Button } from "./ui/button";
import nodemailer from 'nodemailer';
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type Provider = 'google' | 'nodemailer'

export const AuthForm = async ({ provider, className, ...props }: { className?: string, provider: Provider }) => {
  const session = await auth();
  
  // const sendEmail = async (form: HTMLFormElement) => {
  //   const to = form.get('email');

  //   const transport = nodemailer.createTransport({
  //     host: 'smtp.zoho.com',
  //     port: '465',
  //     secure: true,
  //     auth: {
  //       user: '',
  //       pass: ''
  //     }
  //   })
  // }

  return (
    <form
      className={cn("flex flex-col gap-2", className)}
      action={async (form) => {
        "use server"
        if (session) {
          await signOut();
        } else {
          await signIn(provider, { email: 'joeloultook@gmail.com' });
        }
      }}
      {...props}
    >

      <Input type="email" id="email" placeholder="johndoe@email.com" required={false} className={provider === 'google' ? 'hidden' : ''}/>
      <Button type="submit">
        {session ? 'Sign Out' : (
          provider === 'google' ? 'Sign In with Google' : 'Sign In with Email'
      )}</Button>
    </form>
  )
}