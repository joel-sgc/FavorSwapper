"use client"
import { CalendarIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { favor } from "@/auth";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export const FavorComp = ({ favor, className, ...props }: { favor: favor, className?: string }) => {
const [collapsed, setCollapsed] = useState(true);
  
  return (
    <Card className={className}>
      <CardHeader onClick={() => setCollapsed(!collapsed)}>
        <CardTitle className="flex items-center gap-2">
          <Badge>{favor.favorValue}</Badge>
          {favor.title}
        </CardTitle>
        <CardDescription className={collapsed ? 'line-clamp-2' : ''}>{favor.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <UserIcon />
          @{favor.sender.username}
        </div>

        <div className="flex items-center gap-2">
          <CalendarIcon />
          Due Date: {new Date(favor.dueDate).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  )
}