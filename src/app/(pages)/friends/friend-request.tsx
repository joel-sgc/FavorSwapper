"use client"
import { friendRequest } from "@/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { denyFriendReq, sendFriendReq } from "@/lib/friendReqs"
import { Check, X } from "lucide-react"
import { Session } from "next-auth"
import { toast } from "sonner"

export const IncomingFriendRequest = ({ session, request }: { session: Session | null, request: friendRequest }) => {
  const accept = async () => {
    const res = await sendFriendReq( request.sender.username, session?.user as Session["user"] )

    if (res.status === 200) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }
  
  const deny = async () => {
    const res = await denyFriendReq( request.sender.id, session?.user as Session["user"] )

    if (res.status === 200) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="flex w-full gap-2 items-center">
      <div className="flex-1 grid grid-cols-[48px_1fr] gap-4">
        <Avatar>
          <AvatarImage src={request.sender.image} referrerPolicy="no-referrer" className="grid-rows-2 size-12"/>
          <AvatarFallback className="text-lg grid-rows-2 size-12">{request.sender.name.substring(0,1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-start justify-between">
          <span className="font-semibold">{request.sender.name}</span>
          <span className="text-sm text-muted-foreground">{new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="icon" onClick={deny} variant="destructive"><X/></Button>
        <Button size="icon" onClick={accept}><Check/></Button>
      </div>
    </div>
  )
}

export const OutgoingFriendRequest = ({ request }: { request: friendRequest }) => {
  return (
    <div className="flex w-full gap-2 items-center">
      <div className="flex-1 grid grid-cols-[48px_1fr] gap-4">
        <Avatar>
          <AvatarImage src={request.sender.image} referrerPolicy="no-referrer" className="grid-rows-2 size-12"/>
          <AvatarFallback className="text-lg grid-rows-2 size-12">{request.sender.name.substring(0,1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-start justify-between">
          <span className="font-semibold">{request.sender.name}</span>
          <span className="text-sm text-muted-foreground">{new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <Button variant="secondary" className="active:scale-100 hover:bg-secondary cursor-default" aria-hidden role='note'>{request.status}</Button>
    </div>
  )
}