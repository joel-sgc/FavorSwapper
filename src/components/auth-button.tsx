'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export const AuthButton = ({...props}) => {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <Button {...props}>
        <Loader2 className="w-8 h-8 animate-spin"/>
        Loading...
      </Button>
    )
  } else if (status === 'unauthenticated') {
    return (
      <Button {...props} onClick={() => signIn('google')}>
        Sign In
      </Button>
    )
  } else return  (
    <Button {...props} onClick={() => signOut()}>Sign Out</Button>
  )
}