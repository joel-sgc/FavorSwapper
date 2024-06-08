import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeftIcon, PencilIcon } from "lucide-react";
import { AddUserToGroupForm } from "./add-user-form";
import { DeleteGroup } from "./delete-group-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditGroup } from "./edit-group-form";
import { FavorGroup } from "@prisma/client";
import { minimalUser } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "next-auth";
import { ReactNode } from "react";

export const GroupInfoDrawer = async ({ session, group, children, ...props }: { session: Session | null, group?: FavorGroup | null, children: ReactNode }) => {
  const localMembers = JSON.parse(group?.members as string) as minimalUser[];
  const dbMembers = await prisma.user.findMany({ where: { id: { in: localMembers.map(member => member.id) }}});

  const members = dbMembers.map((member) => ({
    id: member.id,
    name: member.name,
    username: member.username,
    image: member.image,
  })) as minimalUser[];

  const admins = JSON.parse(group?.admins as string) as minimalUser[];

  return (
    <Drawer direction="right" {...props}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent variant="right" className="ml-0 w-screen rounded-none">
        <DrawerHeader>  
          <div className="w-full grid grid-cols-[40px_1fr_40px] gap-4 justify-center">
            <DrawerClose asChild>
              <Button size='icon' variant='secondary'>
                <ChevronLeftIcon/>
              </Button>
            </DrawerClose>

            <Avatar className="size-32 mx-auto rounded-lg">
              <AvatarImage src={group?.image as string} alt="" aria-hidden referrerPolicy="no-referrer"/>
              <AvatarFallback className="text-3xl">{group?.name?.substring(0,3).trim()}</AvatarFallback>
            </Avatar>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='icon' variant='secondary'>
                  <PencilIcon/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-fit ml-auto mr-6">
                <DropdownMenuLabel>Group Actions</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                  <EditGroup group={group as FavorGroup} user={session?.user as Session["user"]}><div className="py-1.5 px-2 text-sm cursor-default select-none">Edit Group</div></EditGroup>
                </DropdownMenuItem>
                <DropdownMenuItem>Leave Group</DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                  <DeleteGroup user={session?.user as Session["user"]} groupId={group?.id as string} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h1 className="text-3xl font-semibold text-center line-clamp-2">{group?.name}</h1>

          {/* Members overview */}
          <div className="border-t-2 pt-2 mt-2">
            <p className="text-lg text-muted-foreground text-start w-full">{members.length} {members.length > 1 ? 'members' : 'member'}</p>
            {members.map((member) => (
              <Member key={`member-${member.id}-group-${group?.id}`} member={member} admins={admins}/>
            ))}
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <AddUserToGroupForm group={group as FavorGroup} session={session}/>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const Member = ({ member, admins }: { member: minimalUser, admins: minimalUser[] }) => (
  <div  className="pt-8 grid gap-2 grid-cols-[52px_1fr_40px]">
    <Avatar className="size-13 grid-rows-2">
      <AvatarImage src={member?.image} alt="" aria-hidden referrerPolicy="no-referrer"/>
      <AvatarFallback>{member.name.substring(0,1).trim()}</AvatarFallback>
    </Avatar>

    <div>
      <div className="w-full text-lg font-semibold text-start flex gap-2">{member.name} {admins.some((admin) => admin.id === member.id) && (<Badge>Admin</Badge>)}</div>
      <p className="text-muted-foreground text-start">@{member.username}</p>
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='secondary' className="my-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit ml-auto mr-6">
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem>View Profile</DropdownMenuItem>
        <DropdownMenuItem>Make Admin</DropdownMenuItem>
        <DropdownMenuItem>Kick from Group</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)