import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import * as React from "react";
import Link from 'next/link';
import { User } from "lucide-react";
import { MobileDrawer } from "./mobile-drawer";
import { Session } from "next-auth";
import { ProfileDropdown } from "./profile-dropdown";

export const Header = async ({ session }: { session: Session | null }) => (
  <header className="w-full flex gap-4 items-center justify-between p-4 md:px-8 border border-b-2 sticky top-0 bg-background">
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