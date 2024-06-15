"use client"
import { ScrollArea } from "@/components/ui/scroll-area";
import { badgeVariants } from "@/components/ui/badge";
import { FavorComp } from "@/components/favor-comp";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";
import { favor, favorGroup } from "@/auth";

export const FavorFilterer = ({
  receivedFavors = [],
  sentFavors = [],
  groupFavors = [],
  user,
}: { 
  receivedFavors?: favor[],
  sentFavors?: favor[],
  groupFavors: favorGroup[],
  user?: Session["user"],
}) => {
  const [selected, setSelected] = useState<string[]>(['received']);

  // const groupFavors = user?.receivedFavors.filter((favor) => favor.groupId && favor.sender.id !== user.id);
  
  const isReceived = (selected.includes('received') && receivedFavors) as boolean;
  const isSent = (selected.includes('sent') && sentFavors) as boolean;
  const isGroup = (selected.includes('group') && groupFavors) as boolean;

  return (
    <div className="flex-1 flex flex-col gap-2 mt-2 pt-2 border-t-2">
      <div className="flex gap-2">
        <label className={cn(badgeVariants({ variant: 'secondary' }), 'bg-foreground text-base text-background w-fit flex gap-2 items-center hover:bg-unset select-none', isReceived && 'bg-primary')}>
          <input type="checkbox" className="hidden" checked={isReceived} onChange={() => {
            if (!isSent && !isGroup) return setSelected(['received']);
            setSelected(selected.includes('received') ? selected.filter(s => s !== 'received') : [...selected, 'received'])
          }}/>
          Received
          {selected.includes('received') && <X size={16}/>}
        </label>

        <label className={cn(badgeVariants({ variant: 'secondary' }), 'bg-foreground text-base text-background w-fit flex gap-2 items-center hover:bg-unset select-none', isSent && 'bg-primary')}>
          <input type="checkbox" className="hidden" checked={isSent} onChange={() => {
            if (isSent && !isGroup) return setSelected(['received']);
            setSelected(selected.includes('sent') ? selected.filter(s => s !== 'sent') : [...selected, 'sent'])
          }}/>
          Sent
          {selected.includes('sent') && <X size={16}/>}
        </label>

        <label className={cn(badgeVariants({ variant: 'secondary' }), 'bg-foreground text-base text-background w-fit flex gap-2 items-center hover:bg-unset select-none', isGroup && 'bg-primary')}>
          <input type="checkbox" className="hidden" checked={isGroup} onChange={() => {
            if (!isSent && isGroup) return setSelected(['received']);
            setSelected(selected.includes('group') ? selected.filter(s => s !== 'group') : [...selected, 'group'])
          }}/>
          Groups
          {selected.includes('group') && <X size={16}/>}
        </label>
      </div>

      {(receivedFavors.length === 0 && sentFavors.length === 0 && groupFavors?.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center border-t-2">
          <h1 className="text-5xl font-semibold">No Favors</h1>
          <p className="text-lg text-muted-foreground">You have no favor requests to display</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 max-h-[calc(100dvh-284px)] border-t-2 pt-2 px-1 pb-[56px] overflow-auto">
          {isReceived &&  (
            receivedFavors?.map((favor) => (
              <FavorComp
                key={`favor-user-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`}
                favor={favor}
                className="mt-2"
                isSender={favor.sender.id === user?.id}
                onDecline={() => {}}
                onSetActive={() => {}}
              />
            ))
          )}

          {isSent && (
            sentFavors?.map((favor) => (
              <FavorComp
                key={`favor-user-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`}
                favor={favor}
                className="mt-2"
                isSender={favor.sender.id === user?.id}
                onDecline={() => {}}
                onSetActive={() => {}}
              />
            ))
          )}

          {isGroup && (
            groupFavors?.map((group) => group.favors.map((favor) =>
              <FavorComp
                key={`favor-user-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`}
                favor={favor}
                groupName={group.name}
                className="mt-2"
                isSender={favor.sender.id === user?.id}
                onDecline={() => {}}
                onSetActive={() => {}}
              />
            ))
          )}
        </ScrollArea>
      )}
    </div>
  )
}