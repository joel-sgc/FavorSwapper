"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FavorFormDrawer } from "@/components/favor-form";
import { removeFriend } from "@/lib/friendActions";
import { Button } from "@/components/ui/button";
import { minimalUser } from "@/auth";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export const Friend = ({ friend, user }: { friend: minimalUser, user: Session["user"] }) => {
  const [open, setOpen] = useState(false);

  const remove = async () => {
    const res = await removeFriend({ friend, user });

    if (res.status === 200) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="flex w-full gap-2 items-center">
      <Link href={`/profile/${friend.id}`} className="flex-1 grid grid-cols-[48px_1fr] gap-4">
        <Avatar>
          <AvatarImage src={friend.image} referrerPolicy="no-referrer" className="grid-rows-2 size-12"/>
          <AvatarFallback className="text-lg grid-rows-2 size-12">{friend.name.substring(0,1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-start justify-between">
          <span className="font-semibold">{friend.name}</span>
          <span className="text-sm text-muted-foreground">@{friend.username}</span>
        </div>
      </Link>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant="secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit ml-auto mr-4">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <FavorFormDrawer user={user} friend={friend} className="text-sm px-2 py-1.5">
            Send a Favor Request
          </FavorFormDrawer>
          <hr className="my-2 mx-2"/>
          <DropdownMenuItem onClick={remove}>Remove Friend</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}