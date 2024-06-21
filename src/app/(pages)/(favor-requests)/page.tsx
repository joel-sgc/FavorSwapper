import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { auth, favor, favorGroup, minimalUser } from "@/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FavorComp } from "@/components/favor-comp";
import { PageTitle } from "@/components/page-title";
import { ArrowLeftRightIcon, History } from "lucide-react";
import { FavorFilterer } from "./favor-filterer";
import { Button } from "@/components/ui/button";
import prisma from "@/prisma/client";
import { Session } from "next-auth";

export default async function Home() {
  const session = await auth();
  const groupFavors: favorGroup[] = (await prisma.favorGroup.findMany({ where: {
    id: {
      in: session?.user.favorGroups
    }
  }})).map((group) => { return {
    ...group, 
    favors: JSON.parse(group.favors) as favor[],
    members: JSON.parse(group.members) as minimalUser[],
    admins: JSON.parse(group.admins) as minimalUser[]
  }}) as favorGroup[]

  return (
    <main className="flex-1 flex flex-col p-4 overflow-hidden">
      <PageTitle className="justify-between">
        <div className="flex gap-2 items-center">
          <ArrowLeftRightIcon size={32}/>
          <h1>Favor Requests</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='icon'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit ml-auto mr-4">
            <DropdownMenuLabel>Favor Request Actions</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <Drawer direction="right">
              <DrawerTrigger className="px-2 py-1.5 text-sm">View Favor History</DrawerTrigger>
              <DrawerContent variant="right" className="ml-0 pr-4 w-screen overflow-y-auto rounded-none border-none">
                <PageTitle className="pt-4 border-b-2 pb-2">
                  <History size={32}/>
                  <h1>Favor History</h1>
                </PageTitle>

                <ScrollArea className="max-h-screen py-2 overflow-auto">
                  {session?.user.favorHistory.map((favor) => (
                    <FavorComp
                      key={`favor-user-to-user-${favor.id}-${session.user?.id}-${favor?.receiver?.id as string}`}
                      favor={favor}
                      user={session.user}
                      className="mt-2 first:mt-0"
                    />
                  ))}
                </ScrollArea>
              </DrawerContent>
            </Drawer>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageTitle>

      <FavorFilterer
        receivedFavors={session?.user.receivedFavors}
        sentFavors={session?.user.sentFavors}
        groupFavors={groupFavors}
        user={session?.user as Session["user"] | null}
      />
    </main>
  );
}
