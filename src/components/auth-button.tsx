'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export const AuthButton = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <Button>
        <Loader2 className="w-8 h-8 animate-spin"/>
        Loading...
      </Button>
    )
  } else if (status === 'unauthenticated') {
    return (
      <Button onClick={() => signIn('google')}>
        Sign In
      </Button>
    )
  } else return  (
    <Button onClick={() => signOut()}>Sign Out</Button>
  )
}