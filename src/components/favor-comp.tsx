"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon, CameraIcon, CheckIcon, Component, ComponentIcon, Trash2Icon, UserCheck2Icon, UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Session } from "next-auth";
import { Badge } from "./ui/badge";
import { favor, favorGroup } from "@/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { completeFavorReq, declineFavorReq, markActiveFavorReq } from "@/lib/favorActions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import Camera from "./ui/camera/camera";
import { getGroupFromID } from "@/lib/server-actions";

type FavorProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
  favor: favor,
  user?: Session["user"] | null
  groupName?: string,
}

export const FavorCompGroup = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  user,
  groupName,
  className,
  ...props
}, ref ) => {
  const [collapsed, setCollapsed] = useState(true);
  const isSender = favor.sender.id === user?.id;
  
  const handleDecline = () => {
    // Implement logic to decline the favor
  };

  const handleSetActive = () => {
    // Implement logic to set the favor to active
  };

  return (
    <Card className={className} {...props} ref={ref}>
      <CardHeader onClick={() => setCollapsed(!collapsed)} className="p-4 2xs:p-6">
        <CardTitle className="flex items-center gap-2">
          <Badge className="h-8 min-w-8 items-center justify-center">{favor.favorValue}</Badge>
          {favor.title}
        </CardTitle>
        <CardDescription className={collapsed ? `line-clamp-${favor.sender.id === user?.id ? '1' : '2'}` : ''}>{favor.description}</CardDescription>
      </CardHeader>
      {favor.sender.id !== user?.id && (
        <CardContent className="flex-col items-start gap-2 p-4 2xs:p-6 !pt-0">
          <Link href={`/groups/${favor.groupId}#favor-${favor.id}`} className="flex items-center gap-2">
            <ComponentIcon />
            {groupName && `${groupName} - `}@{favor.sender.username}
          </Link>
          <div className="flex items-center gap-2">
            <CalendarIcon />
            Due Date: {new Date(favor.dueDate).toLocaleDateString()}
          </div>
          {!isSender && (
            <div className="flex items-center justify-between w-full mt-2 gap-2">
              <Button variant='secondary' size='sm'>Ignore</Button>
              <Button size='sm'>Mark Active</Button>
            </div>
          )}
        </CardContent>
      )}
      {favor.working && favor.working.length > 0 && (
        <CardFooter>
          <UserCheck2Icon />
          <span>{favor.working.map((user) => user.username).join(', ')}</span>
        </CardFooter>
      )}
    </Card>
  );
})




export const FavorCompFriend = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  user,
  className,
  ...props
}, ref ) => {
  const [capturedImage, setCapturedImage] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);

  const isSender = favor.sender.id === user?.id;
  const isActive = favor.working && favor.working.length > 0
  const imageTaken = capturedImage.length > 0;

  const onDecline = async () => {
    setLoading(true);
    const res = await declineFavorReq({ favor, user: user as Session["user"] | null });
    setLoading(false);

    if (res.status === 200) toast.success(res.message);
    else toast.error(res.message);
  }

  const onMarkActive = async () => {
    setLoading(true);
    const res = await markActiveFavorReq({ favor, user: user as Session["user"] | null });
    setLoading(false);

    if (res.status === 200) toast.success(res.message);
    else toast.error(res.message);
  }

  const onComplete = async () => {
    setLoading(true);
    let image;

    if (imageTaken) {
      const formData = new FormData();
      formData.set('file', capturedImage[0]);
      formData.append('tags', 'finished_favor');
      
      const req = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      })

      const uploadRes = await req.json()
      image = uploadRes.data;
    }

    const res = await completeFavorReq({ favor, user: user as Session["user"] | null, image });
    setLoading(false);

    if (res.status === 200) toast.success(res.message);
    else toast.error(res.message);
  }

  return (
    <Card className={className} {...props} ref={ref}>
      <CardHeader onClick={() => setCollapsed(!collapsed)} className="p-4 2xs:p-6">
        <CardTitle className="flex items-center gap-2">
          <Badge className="h-8 min-w-8 items-center justify-center">{favor.favorValue}</Badge>
          {favor.title}
        </CardTitle>
        <CardDescription className={collapsed ? `line-clamp-${favor.sender.id === user?.id ? '1' : '2'}` : ''}>{favor.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-col items-start gap-2 p-4 2xs:p-6 !pt-0">
        <Link href={`/profile/${isSender ? favor.receiver?.id : favor.sender.id}`} className="flex items-center gap-2">
          <UserIcon />
          @{isSender ? favor.receiver?.username : favor.sender.username}
        </Link>
        <div className="flex items-center gap-2">
          <CalendarIcon />
          Due Date: {new Date(favor.dueDate).toLocaleDateString()}
        </div>
        {(!isSender) && (
          isActive ? (
            <div className="flex flex-row-reverse flex-wrap justify-between mt-2 gap-2">
              <div className={cn(imageTaken ? "flex items-center justify-evenly gap-2 w-full" : 'w-fit')}>
                <div className="flex flex-col justify-evenly h-full gap-2 w-full">
                  {imageTaken && (
                    <Button disabled={loading} onClick={() => onComplete()} className="w-full">
                      {imageTaken && <CheckIcon className="mr-2"/>}
                      Submit
                    </Button>
                  )}
                  <Dialog
                    open={showDialog}
                    onOpenChange={(open) => setShowDialog(open)}
                  >
                    <DialogTrigger asChild>
                      <Button disabled={loading} variant="outline" className="w-full">
                        {imageTaken && <CameraIcon className="mr-2"/>}
                        {imageTaken ? 'Retake' : 'Capture'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="h-svh w-svw max-w-full p-0">
                      <Camera
                        closeOnFirstPicture
                        onClosed={() => setShowDialog(false)}
                        onCapturedImages={(image) => {
                          setCapturedImage(image);
                          setShowDialog(false);
                          }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                {imageTaken && (
                  <Dialog>
                    <DialogTrigger>
                      <img src={capturedImage[0]} alt="Captured Image" className="max-w-32 max-h-32 rounded-lg" />
                    </DialogTrigger>
                    <DialogContent className="p-0 max-w-[80%] max-h-[80%] overflow-clip">
                      <img src={capturedImage[0]} alt="Captured Image" className="max-h-[80dvh] max-w-[80dvw] mx-auto" />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <Button disabled={loading} size='sm' variant='destructive' onClick={() => onDecline()} className={imageTaken ? 'w-full' : ''}>{imageTaken && <Trash2Icon className="mr-2"/>} Cancel ({favor.favorValue} Point{favor.favorValue > 1 && 's'})</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full mt-2 gap-2">
              <Button disabled={loading} size='sm' variant='destructive' onClick={() => onDecline()}>Decline ({favor.favorValue} Point{favor.favorValue > 1 && 's'})</Button>
              <Button disabled={loading} size='sm' onClick={() => onMarkActive()}>Mark Active</Button>
            </div>
          )
        )}
      </CardContent>
      {isSender && (
        <CardFooter className="pt-0">
          <div className="flex items-center gap-1 mr-1 text-muted-foreground"><div className={cn("size-2 rounded-full", isActive ? 'bg-green-500' : 'bg-red-500')}/> Status:</div>
          <span className="font-semibold">{isActive ? 'Active' : 'Inactive' }</span>
        </CardFooter>
      )}
    </Card>
  )
})

export const FavorComp = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  user,
  groupName,
  className,
  ...props
}, ref) => {
  const isSender = favor.sender.id === user?.id;
  const isActive = favor.working && favor.working.length > 0;
  const [group, setGroup] = useState<favorGroup>();
  const [expandedDescription, setExpandedDescription] = useState(false);

  useEffect(() => {
    (async () => {
      if (favor.groupId) {
        setGroup(await getGroupFromID( favor.groupId ) as unknown as favorGroup)
      }
    })()
  }, [])

  return (
    <Card ref={ref} className={className} {...props} onClick={() => setExpandedDescription(!expandedDescription)}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">{favor.title} <Badge className="h-6 px-2">{favor.favorValue}</Badge></CardTitle>
        <CardDescription className={expandedDescription ? '' : 'line-clamp-2'}>{favor.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {(favor.groupId && group) ? (
            <Link className="grid grid-cols-[24px_1fr] gap-2 items-center" href={`/groups/${favor.groupId}#${favor.id}`}><Component/> {group.name}{!isSender && <> - @{favor.sender.username}</>}</Link>
          ) : (
            <Link className="grid grid-cols-[24px_1fr] gap-2 items-center" href={`/profile/${favor.sender.id}`}><UserIcon/> @{favor.sender.username}</Link>
          )}
        </CardDescription>
        {isSender && (
          <CardDescription className="grid grid-cols-[24px_1fr] gap-2 items-center"><div className={cn('rounded-full size-3 mx-1.5', isActive ? 'bg-green-500' : 'bg-red-500')}/> <span>Status: <span className="text-foreground font-semibold">{isActive ? 'Active' : 'Inactive'}</span></span></CardDescription>
        )}
      </CardContent>
    </Card>
  )
})