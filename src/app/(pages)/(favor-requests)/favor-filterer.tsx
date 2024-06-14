"use client"
import { favor } from "@/auth";
import { FavorComp } from "@/components/favor-comp";
import { badgeVariants } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Session } from "next-auth";
import { Dispatch, SetStateAction, useState } from "react";

export const FavorFilterer = ({ receivedFavors, sentFavors, user }: { receivedFavors?: favor[], sentFavors?: favor[], user?: Session["user"] }) => {
  const [selected, setSelected] = useState<string[]>(['received']);
  
  const isReceived = selected.includes('received') && receivedFavors && receivedFavors.length > 0;
  const isSent = selected.includes('sent') && sentFavors && sentFavors.length > 0;
  // const isGroup = selected.includes('group');

  return (
    <div className="flex-1 flex flex-col gap-2 mt-2 pt-2 border-t-2">
      <div className="flex gap-2">
        <label className={cn(badgeVariants({ variant: 'secondary' }), 'bg-foreground text-base text-background w-fit flex gap-2 items-center hover:bg-unset select-none', isReceived && 'bg-primary')}>
          <input type="checkbox" className="hidden" checked={isReceived} onChange={() => {
            if (!isSent) return setSelected(['received']);
            setSelected(selected.includes('received') ? selected.filter(s => s !== 'received') : [...selected, 'received'])
          }}/>
          Received
          {selected.includes('received') && <X size={16}/>}
        </label>

        <label className={cn(badgeVariants({ variant: 'secondary' }), 'bg-foreground text-base text-background w-fit flex gap-2 items-center hover:bg-unset select-none', isSent && 'bg-primary')}>
          <input type="checkbox" className="hidden" checked={isReceived} onChange={() => {
            if (isSent) return setSelected(['received']);
            setSelected(selected.includes('sent') ? selected.filter(s => s !== 'sent') : [...selected, 'sent'])
          }}/>
          Sent
          {selected.includes('sent') && <X size={16}/>}
        </label>
      </div>

      <ScrollArea className="flex-1 max-h-[631px] border-t-2 pt-2 px-2 pb-[56px] overflow-auto">
        {isReceived &&  (
           receivedFavors.map((favor) => (
            <FavorComp className="mt-2" key={`favor-user-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`} favor={favor}/>
          ))
        )}

        {isSent && (
           sentFavors.map((favor) => (
            <FavorComp className="mt-2" key={`favor-user-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`} favor={favor}/>
          ))
        )}
      </ScrollArea>
    </div>
  )
}