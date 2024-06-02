"use client"

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "../ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu, Settings, User } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react"

export const MobileDrawer = ({ session }: { session: Session | null }) => (
  <Drawer direction="left">
    <DrawerTrigger className="md:hidden">
      <Menu className="h-10 w-auto"/>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold underline text-primary">DACS Favor Swapper</h1>

        <div className="grid grid-cols-[48px_auto] gap-2">
          <Avatar className="row-span-2 size-12">
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

          <div className="flex flex-col justify-between">
            <span className="text-start font-semibold">{session?.user?.name}</span>
            <span className="text-start">Favor Points: {session?.user.favorPoints}</span>
          </div>
        </div>
      </DrawerHeader>
      <DrawerFooter className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between">
          <Button size='icon'>
            <Link href='/settings'>
              <Settings/>
            </Link>
          </Button>

          <Button size='icon'>
            <Link href='/settings'>
              <Settings/>
            </Link>
          </Button>
        </div>

        <Button className="w-full" onClick={() => signOut()}>
          Sign Out
        </Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
)