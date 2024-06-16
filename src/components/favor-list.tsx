"use client"
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import { FavorCompGroup } from "./favor-comp";
import { Session } from "next-auth";
import { favor } from "@/auth";

export const FavorList = ({ user, favors, groupName, className, ...props }: { user?: Session["user"] | null, favors: favor[], groupName?: string, className?: string }) => {
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (favors.length > 0 && lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "instant" }); //Use scrollIntoView to automatically scroll to my ref
    }
  }, [favors.length]);

  return (
    <ScrollArea className={className} {...props}>
      {favors.map((favor, index) => (
        <FavorCompGroup
          favor={favor}
          user={user}
          groupName={groupName}
          className="mt-2 first:mt-0"
          id={`favor-${favor.id}`}
          key={`favor-${favor.id}-${favor.sender.id}-${favor.favorValue}`}
          ref={index === favors.length - 1 ? lastItemRef : null}
          onDecline={() => {}}
          onSetActive={() => {}}
        />
      ))}
    </ScrollArea>
  )
}