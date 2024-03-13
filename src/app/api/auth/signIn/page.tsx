"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { Apple, Google } from "@/components/svg";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push('/');
    }
  }, [status])

  if (status === "loading") return (
    <section className="container flex-1 grid place-content-center">
      <Card>
        <CardHeader className="flex w-full flex-row gap-2"><Loader2 size={24}/> Loading...</CardHeader>
      </Card>
    </section>
  )
  
  return (
    <section className="container flex-1 grid place-content-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign into Favor Swapper through your favorite providers.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => signIn('google', {callbackUrl: '/'})} className="flex gap-2" >
            <Google size={24}/> Sign in with Google
          </Button>
          
          <div className="w-full flex items-center justify-center gap-2">
            <hr className="w-full bg-primary border-primary"/>
            Or
            <hr className="w-full bg-primary border-primary"/>
          </div>

          <Button asChild className="flex gap-2">
            <a href="/api/auth/callback/apple">
              <Apple size={24}/> Sign in with Apple
            </a>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}