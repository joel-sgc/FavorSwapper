import { ProfileDropdown } from "./profile-dropdown";
import { MobileDrawer } from "./mobile-drawer";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import * as React from "react";
import Link from 'next/link';

export const Header = async ({ session }: { session: Session | null }) => (
  <header className="w-full flex gap-4 items-center justify-between p-4 md:px-8 border-b-2 fixed top-0 bg-background z-[49]">
    <MobileDrawer session={session}/>

    <Button asChild variant='link' className="p-0 h-auto text-center">
      <Link href='/' className="inline-flex gap-2">
        <img src="/logo.svg" className="h-12"/>
        <h1 className="text-primary text-3xl font-semibold hidden md:block">DACS Favor Swapper</h1>
      </Link>
    </Button>

    <ProfileDropdown session={session}/>
  </header>
)