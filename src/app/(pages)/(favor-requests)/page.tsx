import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { PageTitle } from "@/components/page-title";
import { ArrowLeftRightIcon } from "lucide-react";
import { FavorFilterer } from "./favor-filterer";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex-1 flex flex-col p-4 overflow-hidden">
      <PageTitle className="justify-between">
        <div className="flex gap-2 items-center">
          <ArrowLeftRightIcon size={32}/>
          <h1>Favor Requests</h1>
        </div>

        <DropdownMenu >
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
              <DrawerContent variant="right" className="ml-0 w-screen rounded-none border-none"></DrawerContent>
            </Drawer>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageTitle>

      <FavorFilterer receivedFavors={session?.user.receivedFavors} sentFavors={session?.user.sentFavors} user={session?.user}/>
    </main>
  );
}
