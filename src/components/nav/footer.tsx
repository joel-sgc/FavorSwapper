"use client"
import { ArrowLeftRightIcon, Coins, PlusIcon, UserPlus2, Users2Icon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { FavorFormDrawer } from "../favor-form";
import { Session } from "next-auth";
import { FavorGroup } from "@prisma/client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getGroupFromID } from "@/lib/server-actions";

export const Footer = ({ session }: { session: Session }) => {
  const [group, setGroup] = useState<FavorGroup | undefined>();
  const pathname = usePathname();

  useEffect(() => {
    (async() => {
      const pathnames = pathname.split('/').filter((str) => str.length > 0);
      if (pathnames[0] === "groups" && pathnames.length > 1) {
        setGroup(await getGroupFromID(pathnames[1]) as FavorGroup);
      } else setGroup(undefined);
    })()
  }, [pathname])

  return (
    <>
      <Button asChild size='icon' className="fixed bottom-[72px] right-4 mb-4 -mt-10 scale-100 border-2">
        <FavorFormDrawer group={group} user={session?.user}>
          <PlusIcon/>
        </FavorFormDrawer>
      </Button>

      <footer className="w-full border-t-2 grid grid-cols-4 gap-4 p-4 bg-background fixed bottom-0 left-0 z-[49]">
        <Button variant='secondary' asChild>
          <Link href='/friends'><UserPlus2/></Link>
        </Button>
        <Button variant='secondary' asChild>
          <Link href='/groups'><Users2Icon/></Link>
        </Button>
        <Button variant='secondary' asChild>
          <Link href='/'><ArrowLeftRightIcon/></Link>
        </Button>
        <Button variant='secondary' asChild>
          <Link href='/points'><Coins/></Link>
        </Button>
      </footer>
    </>
  )
}