"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon, ComponentIcon, UserCheck2Icon, UserIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Session } from "next-auth";
import { Badge } from "./ui/badge";
import { favor } from "@/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { declineFavorReq, markActiveFavorReq } from "@/lib/favorActions";
import { toast } from "sonner";

type FavorProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
  favor: favor,
  user?: Session["user"] | null
  groupName?: string,
}

export const FavorCompGroup = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  user,
  groupName,
  className,
  ...props
}, ref ) => {
  const [collapsed, setCollapsed] = useState(true);
  const isSender = favor.sender.id === user?.id;
  
  const handleDecline = () => {
    // Implement logic to decline the favor
  };

  const handleSetActive = () => {
    // Implement logic to set the favor to active
  };

  return (
    <Card className={className} {...props} ref={ref}>
      <CardHeader onClick={() => setCollapsed(!collapsed)} className="p-4 2xs:p-6">
        <CardTitle className="flex items-center gap-2">
          <Badge className="h-8 min-w-8 items-center justify-center">{favor.favorValue}</Badge>
          {favor.title}
        </CardTitle>
        <CardDescription className={collapsed ? `line-clamp-${favor.sender.id === user?.id ? '1' : '2'}` : ''}>{favor.description}</CardDescription>
      </CardHeader>
      {favor.sender.id !== user?.id && (
        <CardContent className="flex-col items-start gap-2 p-4 2xs:p-6 !pt-0">
          <Link href={`/groups/${favor.groupId}#favor-${favor.id}`} className="flex items-center gap-2">
            <ComponentIcon />
            {groupName && `${groupName} - `}@{favor.sender.username}
          </Link>
          <div className="flex items-center gap-2">
            <CalendarIcon />
            Due Date: {new Date(favor.dueDate).toLocaleDateString()}
          </div>
          {!isSender && (
            <div className="flex items-center justify-between w-full mt-2 gap-2">
              <Button variant='secondary' size='sm'>Ignore</Button>
              <Button size='sm'>Mark Active</Button>
            </div>
          )}
        </CardContent>
      )}
      {favor.working && favor.working.length > 0 && (
        <CardFooter>
          <UserCheck2Icon />
          <span>{favor.working.map((user) => user.username).join(', ')}</span>
        </CardFooter>
      )}
    </Card>
  );
})




export const FavorCompFriend = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  user,
  className,
  ...props
}, ref ) => {
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const isSender = favor.sender.id === user?.id;
  const isActive = favor.working && favor.working.length > 0

  const onDecline = async () => {
    setLoading(true);
    const res = await declineFavorReq({ favor, user: user as Session["user"] | null });
    setLoading(false);

    if (res.status === 200) toast.success(res.message);
    else toast.error(res.message);
  }

  const onMarkActive = async () => {
    setLoading(true);
    const res = await markActiveFavorReq({ favor, user: user as Session["user"] | null });
    setLoading(false);

    if (res.status === 200) toast.success(res.message);
    else toast.error(res.message);
  }

  return (
    <Card className={className} {...props} ref={ref}>
      <CardHeader onClick={() => setCollapsed(!collapsed)} className="p-4 2xs:p-6">
        <CardTitle className="flex items-center gap-2">
          <Badge className="h-8 min-w-8 items-center justify-center">{favor.favorValue}</Badge>
          {favor.title}
        </CardTitle>
        <CardDescription className={collapsed ? `line-clamp-${favor.sender.id === user?.id ? '1' : '2'}` : ''}>{favor.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-col items-start gap-2 p-4 2xs:p-6 !pt-0">
        <Link href={`/profile/${isSender ? favor.receiver?.id : favor.sender.id}`} className="flex items-center gap-2">
          <UserIcon />
          @{isSender ? favor.receiver?.username : favor.sender.username}
        </Link>
        <div className="flex items-center gap-2">
          <CalendarIcon />
          Due Date: {new Date(favor.dueDate).toLocaleDateString()}
        </div>
        {!isSender && (
          <div className="flex items-center justify-between w-full mt-2 gap-2">
            <Button disabled={loading} size='sm' variant='destructive' onClick={() => onDecline()}>{isActive ? 'Cancel' : 'Decline'} ({favor.favorValue} Point{favor.favorValue > 1 && 's'})</Button>
            <Button disabled={loading} size='sm' onClick={() => onMarkActive()}>Mark Active</Button>
          </div>
        )}
      </CardContent>
      {isSender && (
        <CardFooter className="pt-0">
          <div className="flex items-center gap-1 mr-1 text-muted-foreground"><div className={cn("size-2 rounded-full", isActive ? 'bg-green-500' : 'bg-red-500')}/> Status:</div>
          <span className="font-semibold">{isActive ? 'Active' : 'Inactive' }</span>
        </CardFooter>
      )}
    </Card>
  )
})