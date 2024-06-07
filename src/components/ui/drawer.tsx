"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const drawerVariants = cva(
  "fixed inset-x-0 z-50 flex border bg-background !outline-none",
  {
    variants: {
      variant: {
        top: "mb-24 top-0 h-fit flex-col-reverse rounded-b-[10px] [&>div.handle]:mx-auto [&>div.handle]:mb-2 [&>div.handle]:h-2 [&>div.handle]:w-[100px] [&>div>div.drawer-nav]:pb-2",
        bottom: "mt-24 bottom-0 h-fit flex-col rounded-t-[10px] [&>div.handle]:mx-auto [&>div.handle]:mt-2 [&>div.handle]:h-2 [&>div.handle]:w-[100px] [&>div>div.drawer-nav]:pt-2",
        right: "ml-auto right-0 h-screen w-fit rounded-l-[10px] [&>div.handle]:my-auto [&>div.handle]:ml-2 [&>div.handle]:w-2 [&>div.handle]:h-[100px] [&>div>div.drawer-nav]:pl-2",
        left: "mr-24 left-0 h-screen w-fit flex-row-reverse rounded-r-[10px] [&>div.handle]:my-auto [&>div.handle]:mr-2 [&>div.handle]:w-2 [&>div.handle]:h-[100px] [&>div>div.drawer-nav]:pr-2",
      },
    },
    defaultVariants: {
      variant: "top",
    },
  }
)

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80 after:!bg-red-500", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName


interface CustomDrawerProps {
  variant?: "top" | "bottom" | "right" | "left";
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & CustomDrawerProps
>(({ className, variant, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn("right-0", drawerVariants({ variant, className }))}
      {...props}
    >
      <div className="handle rounded-full bg-muted" />
      <div className="h-full w-full flex flex-col">{children}</div>
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("drawer-nav grid gap-1.5 p-6 text-center sm:text-left w-full", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("drawer-nav mt-auto flex flex-col gap-2 p-6", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
