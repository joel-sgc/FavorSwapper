"use server"

import { profileFormSchema } from "@/app/(pages)/settings/profile-form";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma/client";
import { z } from "zod";

export const UpdateProfile = async ( email: string, data: z.infer<typeof profileFormSchema> ) => {
  try {
    await prisma.user.update({
      where: { email },
      data: {
        name: data.name,
        image: data.image,
        imageId: data.imageId,
        username: data.username,
        socials: JSON.stringify({
          tiktok: data.tiktok,
          instagram: data.instagram,
          twitter: data.twitter
        })
      },
    });

    revalidatePath('/', 'layout');
    return { status: 200, message: 'Profile updated successfully.' };
  } catch (error) {
    // Find out what the error is
    console.error(error);
    if (await prisma.user.findFirst({ where: { username: data.username, email: { not: email } }})) {
      return { status: 500, message: 'Username is already taken.' };
    }

    return { status: 500, message: 'An error occurred. Please try again.' }
  } finally {
    await prisma.$disconnect();
  }
}