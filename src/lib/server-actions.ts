"use server"
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const serverRedirect = ( path: string ) => redirect(path);

export const serverRevalidate = ( path: string, type: "layout" | "page" ) => revalidatePath(path, type);

export const getGroupFromID = async ( id: string ) => await prisma.favorGroup.findUnique({ where: { id }});

export const getUserFromID = async ( id: string ) => await prisma.user.findUnique({ where: { id }});