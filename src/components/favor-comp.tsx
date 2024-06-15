"use client"
import { CalendarIcon, ComponentIcon, UserIcon } from "lucide-react";
import React, { useState } from "react";
import { favor } from "@/auth";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

type FavorProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
  favor: favor,
  groupName?: string,
  isSender: boolean, // Added prop to indicate if current user is the sender
  onDecline: () => void, // Callback function for declining the favor
  onSetActive: () => void, // Callback function for setting favor to active
}

export const FavorComp = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  isSender,
  onDecline,
  onSetActive,
  groupName,
  className,
  ...props
}, ref ) => {
  const [collapsed, setCollapsed] = useState(true);
  const isFromGroup = favor.groupId
  
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
        <CardDescription className={collapsed ? 'line-clamp-2' : ''}>{favor.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-2 p-4 2xs:p-6 !pt-0">
        {isFromGroup ? (
          <Link href={`/groups/${favor.groupId}#favor-${favor.id}`} className="flex items-center gap-2">
            <ComponentIcon />
            {groupName} - @{favor.sender.username}
          </Link>
        ) : (
          <Link href={`/profile/${isSender ? favor.receiver?.id : favor.sender.id}`} className="flex items-center gap-2">
            <UserIcon />
            @{isSender ? favor.receiver?.username : favor.sender.username}
          </Link>
        )}
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
  );
});