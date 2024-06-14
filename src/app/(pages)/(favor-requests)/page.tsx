import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FavorComp } from "@/components/favor-comp";
import { PageTitle } from "@/components/page-title";
import { ArrowLeftRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth, favor } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex-1 flex flex-col gap-4 px-4 pb-[72px]">
      <PageTitle className="justify-between flex-wrap sticky top-[82px] z-10 pt-4 bg-background">
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

        <hr className="w-full mb-2 shrink-0 border-t-0 h-0.5 bg-border"/>
      </PageTitle>

      <ScrollArea className="flex-1">
        {(session?.user?.receivedFavors as favor[]).length > 0 && session?.user.receivedFavors.map((favor) => (
          <FavorComp className="mt-2" key={`favor-user-to-user-${favor.id}-${session.user.id}-${favor?.receiver?.id as string}`} favor={favor}/>
        ))}
      </ScrollArea>
    </main>
  );
}
