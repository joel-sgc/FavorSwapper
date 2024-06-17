"use client"

import { ArrowLeftRightIcon, Coins, Menu, MoonIcon, Settings, SunIcon, User, UserPlus2, Users2Icon } from "lucide-react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "../ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  {
    icon: ArrowLeftRightIcon,
    label: 'Requests',
    href: '/'
  },
  {
    icon: UserPlus2,
    label: 'Friends',
    href: '/friends'
  },
  {
    icon: Users2Icon,
    label: 'Groups',
    href: '/groups'
  },
  {
    icon: Coins,
    label: 'Points',
    href: '/points'
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings'
  }
]

export const MobileDrawer = ({ session }: { session: Session | null }) => {
  const [ open, setOpen ] = useState(false);
  const { theme, setTheme } = useTheme();
  
  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="md:hidden">
        <Menu className="h-10 w-auto"/>
      </DrawerTrigger>
      <DrawerContent variant="left" className="border-l-0 overscroll-auto">
        <DrawerHeader className="flex flex-col gap-4 pr-2">
          <h1 className="text-xl font-semibold underline text-primary">DACS Favor Swapper</h1>

          <div className="grid grid-cols-[48px_auto] gap-2">
            <Avatar className="row-span-2 size-12">
              {session ? (
                <>
                  <AvatarImage src={session?.user?.image as string} referrerPolicy="no-referrer"/>
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
              <span className="text-start font-semibold line-clamp-1">{session?.user.name} | @{session?.user?.username}</span>
              <span className="text-start">Favor Points: {session?.user.favorPoints}</span>
            </div>
          </div>

          <nav className="flex flex-col gap-4 pt-16">
            {navLinks.map((link, index) => (
              <Button asChild variant='link' key={`nav-link-${index}`} onClick={() => setOpen(false)} className="w-full text-start justify-start gap-2 text-lg">
                <Link href={link.href}>
                  <link.icon size={32}/>
                  {link.label}
                </Link>
              </Button>
            ))}
          </nav>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col gap-2 w-full pr-2">
          <div className="flex items-center justify-between">
            <Button size='icon' asChild onClick={() => setOpen(false)}>
              <Link href='/settings'>
                <Settings/>
              </Link>
            </Button>

            <Button size='icon' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </div>

          <Button className="w-full" asChild>
            <Link 
              href='/auth/login' 
              onClick={() => {
                signOut();
                setOpen(false);
              }}
            >
              Sign Out
            </Link>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}