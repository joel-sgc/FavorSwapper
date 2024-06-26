"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { badgeVariants } from "@/components/ui/badge";
import { FavorComp } from "@/components/favor-comp";
import { favor, favorGroup } from "@/auth";
import { Session } from "next-auth";
import { useState  } from "react";
import { cn } from "@/lib/utils";

export const FavorFilterer = ({
  receivedFavors = [],
  sentFavors = [],
  groupFavors = [],
  user,
}: {
  receivedFavors?: favor[],
  sentFavors?: favor[],
  groupFavors: favorGroup[],
  user: Session["user"] | null,
}) => {
  const groupReceived = groupFavors.map((group) => {return {...group, favors: group.favors.filter((favor) => favor.sender.id !== user?.id)}})
  const groupSent = groupFavors.map((group) => {return {...group, favors: group.favors.filter((favor) => favor.sender.id === user?.id)}})

  const [selected, setSelected] = useState<string>((sentFavors.length > 0 || groupSent.some((group) => group.favors.length > 0)) ? "sent" : "received");
  const isReceived = selected === "received";
  const isSent = selected === 'sent';

  const [showGroups, setShowGroups] = useState(
    isReceived && receivedFavors.length === 0 && groupReceived.some((group) => group.favors.length > 0) || 
    isSent && sentFavors.length === 0 && groupSent.some((group) => group.favors.length > 0)
  );
  
  const toggleCategory = (category: "received" | "sent") => {
    setSelected(() =>
      selected === category
        ? ["received", "sent"].filter((c) => c !== category)[0]
        : category
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-2 mt-2 pt-2 border-t-2">
      <div className="flex overflow-x-auto gap-1 2xs:gap-2 justify-between 2xs:justify-start">
        <label
          className={cn(
            badgeVariants({ variant: "secondary" }),
            "bg-secondary text-base text-secondary-foreground w-fit flex gap-2 items-center hover:bg-unset select-none shrink-0",
            showGroups && "bg-primary text-background"
          )}
          onContextMenu={(e) => e.preventDefault()}
          onChange={() => setShowGroups(!showGroups)}
        >
          <input type="checkbox" className="hidden"/>
          Include Groups
        </label>

        <label
          className={cn(
            badgeVariants({ variant: "secondary" }),
            "bg-secondary text-base text-secondary-foreground w-fit flex gap-2 items-center hover:bg-unset select-none shrink-0",
            isReceived && "bg-primary text-background"
          )}
          onContextMenu={(e) => e.preventDefault()}
          onChange={() => isSent && toggleCategory("received")}
        >
          <input type="checkbox" className="hidden"/>
          Received
        </label>

        <label
          className={cn(
            badgeVariants({ variant: "secondary" }),
            "bg-secondary text-base text-secondary-foreground w-fit flex gap-2 items-center hover:bg-unset select-none shrink-0",
            isSent && "bg-primary text-background"
          )}
          onContextMenu={(e) => e.preventDefault()}
          onChange={() => isReceived && toggleCategory("sent")}
        >
          <input type="checkbox" className="hidden"/>
          Sent
        </label>
      </div>

      {(
        (isReceived && receivedFavors.length === 0 && (!showGroups || groupReceived.every(group => group.favors.length === 0))) ||
        (isSent && sentFavors.length === 0 && (!showGroups || groupSent.every(group => group.favors.length === 0)))
      ) ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center border-t-2">
          <h1 className="text-5xl font-semibold">No Favors</h1>
          <p className="text-lg text-muted-foreground">
            You have no favor requests to display
          </p>
        </div>
      ) : (
        <ScrollArea className="flex-1 max-h-[calc(100dvh-284px)] border-t-2 pt-2 px-1 pb-[56px] overflow-auto hidden-scrollbar">
          {isReceived &&
            receivedFavors.map((favor) => (
              <FavorComp
                key={`favor-user-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`}
                favor={favor}
                user={user}
                className="mt-2"
              />
            ))}

          {isSent &&
            sentFavors.map((favor) => (
              <FavorComp
                key={`favor-user-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`}
                favor={favor}
                user={user}
                className="mt-2"
              />
            ))}

          {showGroups && (
            (isReceived ? groupReceived : groupSent).map((group) => group.favors.map((favor) => 
              <FavorComp
                key={`favor-group-to-user-${favor.id}-${user?.id}-${favor.groupId as string}`}
                favor={favor}
                user={user}
                className="mt-2"
              />
            )))}
        </ScrollArea>
      )}
    </div>
  );
};
