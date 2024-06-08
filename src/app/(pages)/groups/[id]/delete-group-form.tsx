"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { deleteGroup } from "@/lib/groupActions";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "sonner";

export const DeleteGroup = ({ groupId, user }: { groupId: string, user: Session["user"] }) => {
  const [loading, setLoading] = useState(false);

  const delGroup = async () => {
    setLoading(true);
    const res = await deleteGroup({ groupId, user });

    if (res.status === 200) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }
  
  return (
    <Dialog>
      <DialogTrigger className="py-1.5 px-2 text-sm cursor-default">Delete Group</DialogTrigger>
      <DialogContent className="w-max max-w-[90dvw]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone. All group data will be lost.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row !justify-between gap-2">
          <DialogClose asChild><Button variant="secondary" disabled={loading}>Cancel</Button></DialogClose>
          <Button variant="destructive" className="ml-0" disabled={loading} onClick={() => delGroup()}>Delete Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}