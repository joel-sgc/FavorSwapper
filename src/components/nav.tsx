import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import * as React from "react";
import Link from 'next/link';
import { auth } from "@/auth";
import { Menu, User } from "lucide-react";

export const Header = async () => {
  const session = await auth();

  return (
    <header className="w-full flex gap-4 items-center justify-between p-4 md:px-8">
      <Menu className="md:hidden"/>

      <Button asChild variant='link' className="p-0 h-auto text-center">
        <Link href='/' className="inline-flex gap-2">
          <img src="/logo.svg" className="h-12"/>
          <h1 className="text-primary text-3xl font-semibold hidden md:block">DACS Favor Swapper</h1>
        </Link>
      </Button>

      <Avatar>
        {session ? (
          <>
            <AvatarImage src={session?.user?.image as string}/>
            <AvatarFallback>{session?.user?.email?.substring(0,1).toUpperCase()}</AvatarFallback>
          </>
        ) : (
          <AvatarFallback>
            <Link href='/auth/login'>
              <User/>
            </Link>
          </AvatarFallback>
        )}
      </Avatar>
    </header>
  )
}