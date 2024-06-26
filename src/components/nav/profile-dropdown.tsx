import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Session } from "next-auth";
import { User } from "lucide-react";
import Link from "next/link";

export const ProfileDropdown = ({ session }: { session: Session | null }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="!outline-none">
        <Avatar className="!outline-none">
          {session ? (
            <>
              <AvatarImage src={session?.user?.image as string} referrerPolicy="no-referrer"/>
              <AvatarFallback>{session?.user?.email?.substring(0,1).toUpperCase()}</AvatarFallback>
            </>
          ) : (
            <AvatarFallback>
              <Link href='/auth/login'>
                <User/>
              </Link>
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit ml-auto">
        <DropdownMenuLabel className="hidden md:block">Navigation</DropdownMenuLabel>
        <DropdownMenuSeparator className="hidden md:block" />
        <DropdownMenuItem className="hidden md:block" asChild><Link href='/friends'>Friends</Link></DropdownMenuItem>
        <DropdownMenuItem className="hidden md:block" asChild><Link href='/groups'>Groups</Link></DropdownMenuItem>
        <DropdownMenuItem className="hidden md:block" asChild><Link href='/'>Favors</Link></DropdownMenuItem>
        <DropdownMenuItem className="hidden md:block" asChild><Link href='/points'>Earn FPs</Link></DropdownMenuItem>
        <DropdownMenuSeparator className="hidden md:block" />

        <DropdownMenuLabel>Friend Requests</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        {JSON.stringify(session?.user?.receivedFriendRequests)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}