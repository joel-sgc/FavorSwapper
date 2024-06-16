"use client";
import { FavorCompFriend, FavorCompGroup } from "@/components/favor-comp";
import { ScrollArea } from "@/components/ui/scroll-area";
import { badgeVariants } from "@/components/ui/badge";
import { favor, favorGroup } from "@/auth";
import { Session } from "next-auth";
import { cn } from "@/lib/utils";
import { useState  } from "react";

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
  const [showGroups, setShowGroups] = useState(false);
  const [selected, setSelected] = useState<string>("received");

  const isReceived = selected === "received" && receivedFavors.length > 0;
  const isSent = selected === 'sent' && sentFavors.length > 0;

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
          onChange={() => {if (isSent && sentFavors.length > 0) toggleCategory("received")}}
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
          onChange={() => {if (isReceived && receivedFavors.length > 0) toggleCategory("sent")}}
        >
          <input type="checkbox" className="hidden"/>
          Sent
        </label>
      </div>

      {receivedFavors.length === 0 &&
      sentFavors.length === 0 &&
      groupFavors.length === 0 ? (
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
              <FavorCompFriend
                key={`favor-user-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`}
                favor={favor}
                user={user}
                className="mt-2"
                onDecline={() => {}}
                onSetActive={() => {}}
              />
            ))}

          {isSent &&
            sentFavors.map((favor) => (
              <FavorCompFriend
                key={`favor-user-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`}
                favor={favor}
                user={user}
                className="mt-2"
                onDecline={() => {}}
                onSetActive={() => {}}
              />
            ))}

          {showGroups && (
            groupFavors.map((group) => group.favors.filter((favor) => isReceived ? favor.sender.id !== user?.id : favor.sender.id === user?.id).map((favor) => (
              <FavorCompGroup
                key={`favor-group-to-user-${favor.id}-${user?.id}-${favor?.receiver?.id as string}`}
                favor={favor}
                groupName={group.name}
                user={user}
                className="mt-2"
                onDecline={() => {}}
                onSetActive={() => {}}
              />
            ))))}
        </ScrollArea>
      )}
    </div>
  );
};
