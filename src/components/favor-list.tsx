"use client"
import { favor } from "@/auth";
import { useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { FavorComp } from "./favor-comp";

export const FavorList = ({ favors, className, ...props }: { favors: favor[], className?: string }) => {
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
        />
      ))}
    </ScrollArea>
  )
}