"use client"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon, ComponentIcon, UserIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Session } from "next-auth";
import { Badge } from "./ui/badge";
import { favor } from "@/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FavorProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
  favor: favor,
  user?: Session["user"] | null
  groupName?: string,
  onDecline: () => void, // Callback function for declining the favor
  onSetActive: () => void, // Callback function for setting favor to active
}

export const FavorCompGroup = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  user,
  onDecline,
  onSetActive,
  groupName,
  className,
  ...props
}, ref ) => {
  const [collapsed, setCollapsed] = useState(true);
  const isSender = favor.sender.id === user?.id;
  
  const handleDecline = () => {
    // Implement logic to decline the favor
    onDecline();
  };

  const handleSetActive = () => {
    // Implement logic to set the favor to active
    onSetActive();
  };

  return (
    <Card className={className} {...props} ref={ref}>
      <CardHeader onClick={() => setCollapsed(!collapsed)} className="p-4 2xs:p-6">
        <CardTitle className="flex items-center gap-2">
          <Badge className="h-8 min-w-8 items-center justify-center">{favor.favorValue}</Badge>
          {favor.title}
        </CardTitle>
        <CardDescription className={cn("transition-all", collapsed ? 'line-clamp-2' : '')}>{favor.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-2 p-4 2xs:p-6 !pt-0">
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
      </CardFooter>
    </Card>
  );
})




export const FavorCompFriend = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  user,
  onDecline,
  onSetActive,
  className,
  ...props
}, ref ) => {
  const [collapsed, setCollapsed] = useState(true);
  const isSender = favor.sender.id === user?.id;

  return (
    <Card className={className} {...props} ref={ref}>
      <CardHeader onClick={() => setCollapsed(!collapsed)} className="p-4 2xs:p-6">
        <CardTitle className="flex items-center gap-2">
          <Badge className="h-8 min-w-8 items-center justify-center">{favor.favorValue}</Badge>
          {favor.title}
        </CardTitle>
        <CardDescription className={cn("transition-all", collapsed ? 'line-clamp-2' : '')}>{favor.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-2 p-4 2xs:p-6 !pt-0">
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
            <Button variant='destructive' size='sm'>Decline ({favor.favorValue} Point{favor.favorValue > 1 && 's'})</Button>
            <Button size='sm'>Mark Active</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
})