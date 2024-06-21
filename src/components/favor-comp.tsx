"use client"
import { CalendarIcon, CameraIcon, CheckIcon, ComponentIcon, Trash2Icon, UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { acceptFavorReq, cancelFavorReq, completeFavorReq, declineFavorReq, ignoreFavorReq } from "@/lib/favorActions";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { favor, favorGroup, minimalUser } from "@/auth";
import { getGroupFromID } from "@/lib/server-actions";
import React, { useEffect, useState } from "react";
import Camera from "./ui/camera/camera";
import { Button } from "./ui/button";
import { Session } from "next-auth";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

type FavorProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
  favor: favor,
  user: Session["user"] | null
}

export const FavorComp = React.forwardRef<HTMLDivElement, FavorProps>(({
  favor,
  user,
  className,
  ...props
}, ref) => {
  const [loading, setLoading] = useState(false);
  const [ignore, setIgnore] = useState(favor.ignoring?.some((u) => u.id === user?.id));
  const [group, setGroup] = useState<favorGroup | null>(null);
  const [expandedDescription, setExpandedDescription] = useState(false);

  const [capturedImage, setCapturedImage] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  
  const isSender = favor.sender.id === user?.id;
  const isGroup = (favor.groupId !== undefined && favor.groupId.length > 0) && (group && group !== undefined);
  const isActive = (
    favor.working && favor.working.length > 0 &&
    ((isGroup && !isSender) ? favor.working.some((p) => p.id === user?.id ) : true)
  );

  useEffect(() => {
    (async () => {
      if (favor.groupId && favor.groupId.length > 0) {
        setGroup(await getGroupFromID( favor.groupId ) as unknown as favorGroup ?? null)
      }
    })()
  }, [])

  const onCancel = async () => {
    setLoading(true);
    const res = await cancelFavorReq({ favor, user });
    setLoading(false);

    if (res.status === 200) toast.success(res.message);
    else toast.error(res.message);
  }

  const onIgnore = async () => {
    setLoading(true);
    const res = await ignoreFavorReq({ favor, user });
    setLoading(false);

    if (res.status === 200) setIgnore(true);
    else toast.error(res.message);
  }

  const onDecline = async () => {
    setLoading(true);
    const res = await declineFavorReq({ favor, user });
    setLoading(false);

    if (res.status === 200) {
      toast.success(res.message);
      setIgnore(true);
    } else toast.error(res.message);
  }

  const onAccept = async () => {
    setLoading(true);
    const res = await acceptFavorReq({ favor, user });
    setLoading(false);

    if (res.status === 200) {
      toast.success(res.message);
      setIgnore(false);
    } else toast.error(res.message);
  }

  const onComplete = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.set('file', capturedImage[0]);
    formData.append('tags', 'finished_favor');
    
    const req = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    const uploadRes = await req.json()
    const image = uploadRes.data;

    const res = await completeFavorReq({ favor, user, image });
    setLoading(false);

    if (res.status === 200) toast.success(res.message);
    else toast.error(res.message);
  }

  return (
    <Card ref={ref} className={className} {...props} onClick={() => setExpandedDescription(!expandedDescription)}>
      {/* Favor Title, Value, and Description */}
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">{favor.title} <Badge className="h-6 px-2">{favor.favorValue}</Badge></CardTitle>
        <CardDescription className={expandedDescription ? '' : 'line-clamp-2'}>{favor.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* (Sender / Group) Information */}
        {!ignore && (
          (favor.groupId && group === null) ? (
            <CardDescription>Loading...</CardDescription>
          ) : (
            <CardDescription>
              {isGroup ? (
                <Link className="grid grid-cols-[24px_1fr] gap-2 items-center" href={`/groups/${favor.groupId}#${favor.id}`}><ComponentIcon/> {group.name}{!isSender && <> - @{favor.sender.username}</>}</Link>
              ) : (
                isSender ? (
                  <Link className="grid grid-cols-[24px_1fr] gap-2 items-center" href={`/profile/${(favor.receiver as minimalUser).id}`}><UserIcon/> @{(favor.receiver as minimalUser).username}</Link>
                ) : (
                  <Link className="grid grid-cols-[24px_1fr] gap-2 items-center" href={`/profile/${favor.sender.id}`}><UserIcon/> @{(favor.sender as minimalUser).username}</Link>
                )
              )}
            </CardDescription>  
          )
        )}

        {/* Status */}
        {(isSender || favor.completed) && (
          <CardDescription className="grid grid-cols-[24px_1fr] gap-2 items-center mt-2">
            <span className={cn('rounded-full size-3 mx-1.5', isActive ? 'bg-green-500' : 'bg-red-500')}/>
            <span>
              Status: <span className="text-foreground font-semibold">
                {favor.completed ? "Completed" : isActive ? "Active" : "Inactive"}
              </span>
            </span>
            </CardDescription>
        )}

        {/* List Working Users (Groups Only) */}
        {(isGroup && isActive && !ignore && !favor.completed) && (
          <div className="w-full flex flex-wrap gap-2 mt-2">
            {favor.working?.map((worker) => <Badge key={`favor-${favor.id}-${worker.id}`}>{worker.name}</Badge>)}
          </div>
        )}

        {/* ((Decline / Ignore) or (Mark as Active)) */}
        {!favor.completed && ((favor.groupId && group === null) ? (
          <CardDescription>Loading...</CardDescription>
        ) : (
          isSender ? (
            <Button
              size='sm'
              className="mt-2"
              variant='destructive'
              disabled={loading}
              onClick={() => onCancel()}    // Cancellation fee handled in onCancel function
            >Cancel {isActive && `(${favor.favorValue} Favor Point${favor.favorValue > 1 ? 's' : ''})`}</Button>
          ) : (
            <div className="flex gap-2 items-center mt-2">
              {isGroup ? (
                isActive ? (
                  <>
                    {capturedImage.length === 0 ? (
                      <Button
                        size='sm'
                        variant='destructive'
                        disabled={loading}
                        onClick={() => onDecline()}
                      >
                        Cancel {isActive && `(${favor.favorValue} Favor Point${favor.favorValue > 1 && 's'})`}
                      </Button>
                    ) : (
                      <Button disabled={loading} size='icon' variant='destructive' onClick={() => setCapturedImage([])}>
                        <Trash2Icon/>
                      </Button>
                    )}

                    <CompleteButton
                      dialogOpen={showDialog}
                      setDialogOpen={setShowDialog}
                      loading={loading}
                      imageTaken={capturedImage.length > 0}
                      setCapturedImage={setCapturedImage}
                    />

                    {capturedImage.length > 0 && (
                      <Button
                        size='sm'
                        disabled={loading}
                        onClick={() => onComplete()}
                        className="ml-auto"
                      >
                        Submit
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    {!ignore && (
                      <Button
                        size='sm'
                        variant='secondary'
                        disabled={loading}
                        onClick={() => onIgnore()}
                      >Ignore</Button>
                    )}

                    <Button
                      size='sm'
                      disabled={loading}
                      onClick={() => onAccept()}
                    >Accept</Button>
                  </>
                )
              ) : (
                isActive ? (
                  <>
                    {capturedImage.length === 0 ? (
                      <Button
                        size='sm'
                        variant='destructive'
                        disabled={loading}
                        onClick={() => onDecline()}
                      >
                        Cancel {isActive && `(${favor.favorValue} Favor Point${favor.favorValue > 1 && 's'})`}
                      </Button>
                    ) : (
                      <Button disabled={loading} size='icon' variant='destructive' onClick={() => setCapturedImage([])}>
                        <Trash2Icon/>
                      </Button>
                    )}

                    <CompleteButton
                      dialogOpen={showDialog}
                      setDialogOpen={setShowDialog}
                      loading={loading}
                      imageTaken={capturedImage.length > 0}
                      setCapturedImage={setCapturedImage}
                    />

                    {capturedImage.length > 0 && (
                      <Button
                        size='sm'
                        disabled={loading}
                        onClick={() => onComplete()}
                        className="ml-auto"
                      >
                        Submit
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      size='sm'
                      variant='secondary'
                      disabled={loading}
                      onClick={() => onDecline()}
                    >Decline {`(${favor.favorValue} Favor Point${favor.favorValue > 1 ? 's' : ''})`}</Button>

                    <Button
                      size='sm'
                      disabled={loading}
                      onClick={() => onAccept()}
                    >Accept</Button>
                  </>
                )
              )}
            </div>
          )
        ))}

        {/* (Image Capture) */}
          {(capturedImage.length > 0 || favor.completed) && (
            <Dialog>
              <DialogTrigger asChild>
                <img src={capturedImage[0] ?? favor.completionImage} alt="Captured Image" className="w-full rounded-lg aspect-video object-cover object-center mt-2" />
              </DialogTrigger>
              <DialogContent className="p-0 max-w-[80%] max-h-[80%] overflow-clip">
                <img src={capturedImage[0] ?? favor.completionImage} alt="Captured Image" className="max-h-[80dvh] max-w-[80dvw] mx-auto" />
              </DialogContent>
            </Dialog>
          )}
      </CardContent>
    </Card>
  )
})

const CompleteButton = ({ 
  dialogOpen, 
  setDialogOpen, 
  loading, 
  imageTaken, 
  setCapturedImage
}: {
  dialogOpen: boolean,
  setDialogOpen: (open: boolean) => void,
  loading: boolean,
  imageTaken: boolean,
  setCapturedImage: (image: string[]) => void
}) => (
  <Dialog
    open={dialogOpen}
    onOpenChange={setDialogOpen}
  >
    <DialogTrigger asChild>
      <Button disabled={loading} size='sm' className={imageTaken ? "" : "ml-auto"}>
        {imageTaken ? 'Retake' : 'Complete'}
      </Button>
    </DialogTrigger>
    <DialogContent className="h-svh w-svw max-w-full p-0">
      <Camera
        closeOnFirstPicture
        onClosed={() => setDialogOpen(false)}
        onCapturedImages={(image) => {
          setCapturedImage(image);
          setDialogOpen(false);
        }}
      />
    </DialogContent>
  </Dialog>
)