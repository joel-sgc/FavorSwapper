'use client'

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, useSession } from "next-auth/react";
import { CircleUserRound, Menu } from "lucide-react";
import { AuthButton } from "./auth-button";
import { Button } from "./ui/button";

export const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="border-b-2 py-2 mb-4">
      <div className="flex items-center justify-between container">
        <MainSidebar />
        
        <img src='Andy.svg' alt='logo' width={40} height={40} className="w-10 h-10"/>

        <div className="w-10 h-10">
          {session ? (
            <Avatar>
              <AvatarImage src={session.user?.image as string} referrerPolicy="no-referrer"/>
              <AvatarFallback>{session.user?.name?.slice(0,1) || <CircleUserRound/>}</AvatarFallback>
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

const MainSidebar = () => (
  <Drawer direction='left'>
    <DrawerTrigger aria-label="Open Menu Drawer">
      <Menu width={40} height={40}/>
    </DrawerTrigger>
    <DrawerContent variant='left'>
      <DrawerHeader>
        <DrawerTitle>DACS Favor Swapper</DrawerTitle>
      </DrawerHeader>
      <div className="flex-1">

      </div>
      <DrawerFooter>
        <AuthButton/>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
)