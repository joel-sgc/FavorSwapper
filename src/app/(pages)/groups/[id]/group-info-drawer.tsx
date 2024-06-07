import { minimalUser } from "@/auth";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { FavorGroup } from "@prisma/client";
import { LogOutIcon, Trash2Icon } from "lucide-react";
import { ReactNode } from "react";

export const GroupInfoDrawer = ({ group, children, ...props }: { group?: FavorGroup | null, children: ReactNode }) => (
  <Drawer direction="right">
    <DrawerTrigger asChild>{children}</DrawerTrigger>
    <DrawerContent variant="right">
      <DrawerHeader>
        <h1 className="text-xl font-semibold underline text-primary">{group?.name}</h1>

        {/* Members overview */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Members</h2>
          <ul className="text-start">
            {JSON.parse(group?.members as string).map((member: any) => (
              <li key={member.id}>{member.name}{(JSON.parse(group?.admins as string) as minimalUser[]).some((m) => m.id === member.id) ? ' - Group Admin' : ''}</li>
            ))}
          </ul>
        </div>
      </DrawerHeader>
      <DrawerFooter>
        <Button variant='destructive' className="w-full flex gap-3"><LogOutIcon size={24}/> Leave Group</Button>
        <Button variant='destructive' className="w-full flex gap-3"><Trash2Icon size={24}/> Delete Group</Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
)