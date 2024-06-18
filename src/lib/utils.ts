import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "@prisma/client";
import { minimalUser } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "next-auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const minifyUser = ( user: Session["user"] | null | User ) => {
  return {
    id: user?.id,
    name: user?.name,
    username: user?.username,
    image: user?.image,
  } as minimalUser
}

export const chargePoints = async ({ where, points }: { where: { username?: string, id?: string }, points: number }) => {
  if (process.env.NODE_ENV === 'development') return { status: 200, message: "Success!" };

  const user = await prisma.user.findUnique({ where });

  if (!user) return { status: 404, message: "User not found" };

  if ((user.favorPoints as number) < points) {
    return { status: 401, message: "Insufficient funds." };
  } 

  await prisma.user.update({
    where,
    data: {
      favorPoints: user.favorPoints - points
    }
  });

  return { status: 200, message: "Success!" };
}