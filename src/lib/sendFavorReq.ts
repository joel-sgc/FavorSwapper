"use server"
import { FavorGroup, User } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";
import { favor, minimalUser } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "next-auth";

export const sendFavorReq = async ({ favor, user }: { favor: favor, user: Session["user"] | null }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to add a user to a group." };

    // Make sure the user isn't trying to send himself a favor request
    if (favor.receiver?.id === user.id) return { status: 403, message: "You can't send a favor request to yourself." };

    let recipient = undefined as User | FavorGroup | undefined;
    // Check if recipient exists
    if (favor.groupId) {
      recipient = await prisma.favorGroup.findUnique({ where: { id: favor.groupId }}) as FavorGroup;
      if (!recipient) return { status: 404, message: "Group not found." };
    
      // Make sure the user is part of the group
      if (!(JSON.parse(recipient.members) as minimalUser[]).some((member) => member.id === user.id)) {
        return { status: 403, message: "You must be a member of the group to send a favor request." };
      }

      // Send favor request
      await prisma.user.update({
        where: { id: user.id },
        data: {
          sentFavors: JSON.stringify([
            ...user.sentFavors,
            {
              ...favor,
              id: createId()
            }
          ])
        }
      });

      await prisma.favorGroup.update({
        where: { id: favor.groupId },
        data: {
          favors: JSON.stringify([
            ...JSON.parse(recipient.favors),
            {
              ...favor,
              id: createId()
            }
          ])
        }
      });
    } else if (favor.receiver?.id) {
      recipient = await prisma.user.findUnique({ where: { id: favor.receiver.id }}) as User;
      if (!recipient) return { status: 404, message: "User not found." };

      // Check if user is friends with the recipient
      if (!(user.friends as minimalUser[]).some((friend) => friend.id === recipient?.id)) {
        return { status: 403, message: "You must be friends with the recipient to send a favor request." };
      }

      // Send favor request
      await prisma.user.update({
        where: { id: user.id },
        data: {
          sentFavors: JSON.stringify([
            ...user.sentFavors,
            {
              ...favor,
              id: createId()
            }
          ])
        }
      });

      // Update recipient's received favors
      await prisma.user.update({
        where: { id: favor.receiver.id },
        data: {
          receivedFavors: JSON.stringify([
            ...JSON.parse(recipient.receivedFavors),
            {
              ...favor,
              id: createId()
            }
          ])
        }
      });
    } 

    revalidatePath('/', 'layout');
    return { status: 200, message: "Favor request sent." }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "An error occurred while sending the favor request." }
  } finally {
    prisma.$disconnect();
  }
}