"use server"
import { redirect } from "next/navigation";

export const serverRedirect = ( path: string ) => redirect(path);