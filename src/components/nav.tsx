'use client'

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { CircleUserRound, Coins, Home, LayoutList, Menu, Settings, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, useSession } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { AuthButton } from "./auth-button";
import { Button } from "./ui/button";
import { Session } from "next-auth";
import { useState } from "react";


export const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className={`border-b-2 py-2 sticky top-0 transition-all bg-background z-[49] ${status === "unauthenticated" ? '!fixed w-full !top-[-100vh] opacity-0' : ''}`}>
      <div className="flex items-center justify-between container">
        <MainSidebar session={session}/>
        
        <img src='/Andy.svg' alt='logo' width={40} height={40} className="size-10"/>

        <div className="w-10 h-10">
          {session ? (
            <Avatar>
              <AvatarImage src={session.user?.image as string} referrerPolicy="no-referrer"/>
              <AvatarFallback className="bg-primary text-background">{session.user?.name?.slice(0,1) || <CircleUserRound/>}</AvatarFallback>
            </Avatar>
          ) : (
            <Button aria-label='Sign in button' className="text-white p-0 bg-background cursor-pointer hover:bg-transparent" asChild onClick={() => signIn('google')}>
              <Avatar>
                <AvatarImage src='' referrerPolicy="no-referrer"/>
                <AvatarFallback><CircleUserRound/></AvatarFallback>
              </Avatar>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

const MainSidebar = ({ session }: { session: Session | null }) => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction='left' open={!session ? false : open} onOpenChange={setOpen}>
      <DrawerTrigger aria-label="Open Menu Drawer">
        <Menu width={40} height={40}/>
      </DrawerTrigger>
      <DrawerContent variant='left'>
        <DrawerHeader className="grid gap-4">
          <DrawerTitle>DACS Favor Swapper</DrawerTitle>

          <div className="grid grid-cols-[64px_1fr] gap-4">
            <img src={session?.user?.image as string} className="size-16 rounded-full border-2"/>

            <div>
              <div className="text-start">{session?.user?.name}</div>
              <div className="text-primary text-start">FPs: {session?.user.favorPoints}</div>
            </div>
          </div>
        </DrawerHeader>
        <div className="flex-1">

        </div>
        <DrawerFooter className="grid grid-cols-[40px_1fr_40px]">
          <Button size='icon' asChild onClick={() => setOpen(false)}>
            <a href="/account">
              <Settings size={24}/>
            </a>
          </Button>

          <br/>

          <ThemeToggle/>

          <AuthButton className="col-span-3"/>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}


export const Footer = () => {
  const { status } = useSession();

  return (
    <footer className={`bg-background border-t-2 py-2 sticky bottom-0 transition-all ${status === "unauthenticated" ? '!fixed w-full !bottom-[-100vh]' : ''}`}>
      <div className="flex items-center justify-evenly container">
        <Button size='icon' variant='ghost' className="p-2 w-full">
          <LayoutList size={24}/>
        </Button>
        <Button asChild size='icon' variant='ghost' className="p-2 w-full">
          <a href="/"><Home size={24}/></a>
        </Button>
        <Button asChild size='icon' variant='ghost' className="p-2 w-full">
          <a href="/points"><Coins size={24}/></a>
        </Button>
      </div>
    </footer>
  )
}