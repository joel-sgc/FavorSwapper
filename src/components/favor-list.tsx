"use client"
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import { FavorComp } from "./favor-comp";
import { Session } from "next-auth";
import { favor } from "@/auth";

export const FavorList = ({ user, favors, className, ...props }: { user?: Session["user"] | null, favors: favor[], className?: string }) => {
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (favors.length > 0 && lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "instant" }); //Use scrollIntoView to automatically scroll to my ref
    }
  }, [favors.length]);

  return (
    <ScrollArea className={className} {...props}>
      {favors.map((favor, index) => (
        <FavorComp
          favor={favor}
          className="mt-2 first:mt-0"
          key={`favor-${favor.id}-${favor.sender.id}-${favor.favorValue}`}
          ref={index === favors.length - 1 ? lastItemRef : null}
          isSender={favor.sender.id === user?.id}
          onDecline={() => {}}
          onSetActive={() => {}}
        />
      ))}
    </ScrollArea>
  )
}