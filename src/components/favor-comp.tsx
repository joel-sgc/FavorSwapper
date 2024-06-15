"use client"
import { CalendarIcon, UserIcon } from "lucide-react";
import React, { useState } from "react";
import { favor } from "@/auth";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type FavorProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
  favor: favor,
  isSender: boolean, // Added prop to indicate if current user is the sender
  onDecline: () => void, // Callback function for declining the favor
  onSetActive: () => void, // Callback function for setting favor to active
}

export const FavorComp = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  isSender,
  onDecline,
  onSetActive,
  className,
  ...props
}, ref ) => {
  const [collapsed, setCollapsed] = useState(true);
  
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
        <div className="flex items-center gap-2">
          <UserIcon />
          @{favor.sender.username}
        </div>
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