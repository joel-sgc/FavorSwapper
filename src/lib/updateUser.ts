"use server"

import { profileFormSchema } from "@/app/api/settings/profile-form";
import prisma from "@/prisma/client";
import { z } from "zod";

export const UpdateUser = async ( email: string, data: z.infer<typeof profileFormSchema> ) => {
  try {
    await prisma.user.update({
      where: { email },
      data: {
        name: data.name,
        username: data.username,
        socials: JSON.stringify({
          tiktok: data.tiktok,
          instagram: data.instagram,
          twitter: data.twitter
        })
      },
    });

    return { status: 200, message: 'Profile updated successfully.' };
  } catch (error) {
    // Find out what the error is
    if (await prisma.user.findUnique({ where: { username: data.username }})) {
      return { status: 500, message: 'Username is already taken.' };
    }

    return { status: 500, message: 'An error occurred. Please try again.' }
  } finally {
    await prisma.$disconnect();
  }
}