import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ChevronLeftIcon, Component, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupInfoDrawer } from "./group-info-drawer";
import { FavorComp } from "@/components/favor-comp";
import { FavorForm } from "@/components/favor-form";
import { PageTitle } from "@/components/page-title";
import { auth, favor, favorGroup } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import { Session } from "next-auth";
import Link from "next/link";

const GroupPage = async ({ params }: { params: { id: string }}) => {
  const group = await prisma.favorGroup.findUnique({ where: { id: params.id }});
  if (!group) return redirect('/groups');

  const session = await auth();

  // Check to make sure we are within the group
  const members = JSON.parse(group?.members as string) as favorGroup[]
  const isMember = members.some(member => member.id === session?.user.id)

  // Parse favors
  const favors = JSON.parse(group?.favors as string) as favor[]

  if (isMember) return (
    <main className="flex-1 flex flex-col gap-4 p-4">
      <PageTitle className="justify-between">
        <div className="flex items-center gap-2">
          <Button variant='secondary' size='icon' className="mr-2" asChild>
            <Link href='/groups'><ChevronLeftIcon/></Link>
          </Button>
          
          <Component size={32} />
          <h1>{group ? group?.name : "Loading..."}</h1>
        </div>
    
        <GroupInfoDrawer group={group} session={session}>
          <Button variant='secondary' size='icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1"/>
              <circle cx="12" cy="12" r="1"/>
              <circle cx="12" cy="19" r="1"/>
            </svg>
          </Button>
        </GroupInfoDrawer>
      </PageTitle>


      {/* LOADING */}
      {!group ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={64} className="animate-spin"/>
        </div>
      ) : favors.length === 0 ? (
        <div className="w-full h-full flex-1 border-t-2 text-center flex flex-col gap-2 items-center justify-center">
          <Component size={128} />
          <h2 className="text-2xl font-semibold">No active Favor Requests found...</h2>
          <span className="text-muted-foreground">Be the first to request a favor!</span>

          <Drawer>
            <DrawerTrigger asChild>
              <Button>Request a Favor</Button>
            </DrawerTrigger>
            <DrawerContent className="p-4 max-h-[90dvh]">
              <ScrollArea className="overflow-auto">
                <FavorForm user={session?.user as Session["user"]} group={group} className="mx-2 my-[6px]"/>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        </div>
      ) : (
        <ScrollArea className="w-full h-full flex-1 border-t-2 pt-4">
          {favors.map(favor => (
            <FavorComp favor={favor} key={`favor-${group?.id}-${favor.id}`}/>
          ))}
        </ScrollArea>
      )}
    </main>
  )
  else redirect('/groups');
}

export default GroupPage