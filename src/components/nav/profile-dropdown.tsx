import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { User } from "lucide-react";

export const ProfileDropdown = ({ session }: { session: Session | null }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="!outline-none">
        <Avatar className="!outline-none">
          {session ? (
            <>
              <AvatarImage src={session?.user?.image as string}/>
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
      <DropdownMenuContent align="end">
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