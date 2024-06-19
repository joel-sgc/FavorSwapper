"use server"
import { FavorGroup, User } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";
import { favor, minimalUser } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "next-auth";
import { chargePoints, minifyUser } from "./utils";

export const sendFavorReq = async ({ favor, user }: { favor: favor, user: Session["user"] | null }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to add a user to a group." };

    // Make sure the user isn't trying to send himself a favor request
    if (favor.receiver?.id === user?.id) return { status: 403, message: "You can't send a favor request to yourself." };
    
    // Make sure the user has the required amount of favor points
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
    if (favor.favorValue > (dbUser?.favorPoints as number)) return { status: 401, message: "Insufficient funds" };

    let recipient = undefined as User | FavorGroup | undefined;
    // Check if recipient exists
    if (favor.groupId) {
      recipient = await prisma.favorGroup.findUnique({ where: { id: favor.groupId }}) as FavorGroup;
      if (!recipient) return { status: 404, message: "Group not found." };
    
      // Make sure the user is part of the group
      if (!(JSON.parse(recipient.members) as minimalUser[]).some((member) => member.id === user.id)) {
        return { status: 403, message: "You must be a member of the group to send a favor request." };
      }

      const id = createId()

      // Send favor request
      await prisma.user.update({
        where: { id: user.id },
        data: {
          sentFavors: JSON.stringify([
            ...user.sentFavors,
            {
              ...favor,
              ignoring: [],
              working: [],
              id
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
              ignoring: [],
              working: [],
              id
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

      const id = createId()

      // Send favor request
      await prisma.user.update({
        where: { id: user.id },
        data: {
          sentFavors: JSON.stringify([
            ...user.sentFavors,
            {
              ...favor,
              ignoring: [],
              working: [],
              id
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
              ignoring: [],
              working: [],
              id
            }
          ])
        }
      });
    } 

    // Finally, charge favor points
    await chargePoints({
      where: { id: dbUser?.id, username: dbUser?.username as string },
      points: favor.favorValue
    });

    revalidatePath('/', 'layout');
    return { status: 200, message: "Favor request sent." }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "An error occurred while sending the favor request." }
  } finally {
    prisma.$disconnect();
  }
}

export const declineFavorReq = async ({ favor, user }: { favor: favor, user: Session["user"] | null }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to decline a favor request." };

    // Make sure the user is the recipient of the favor
    if (favor.receiver?.id !== user?.id) return { status: 403, message: "You can't decline a favor request that isn't addressed to you." };

    // Make sure the user has the favor request in their received favors
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
    if (!(JSON.parse(dbUser?.receivedFavors as string) as favor[]).some((f) => f.id === favor.id)) return { status: 404, message: "Favor request not found." };

    // Make sure user has required favor points to decline the favor
    if (favor.favorValue > (dbUser?.favorPoints as number)) return { status: 401, message: "Insufficient funds" };

    // Decline the favor request
    await prisma.user.update({
      where: { id: user.id },
      data: {
        receivedFavors: JSON.stringify((JSON.parse(dbUser?.receivedFavors as string) as favor[]).filter((f) => f.id !== favor.id))
      }
    });

    // Remove favor from sender's sent favors and move it to favor history
    const sender = await prisma.user.findUnique({ where: { id: favor.sender.id }});

    await prisma.user.update({
      where: { id: favor.sender.id },
      data: {
        sentFavors: JSON.stringify((JSON.parse(sender?.sentFavors as string) as favor[]).filter((f) => f.id !== favor.id)),
        favorHistory: JSON.stringify([
          ...JSON.parse(sender?.favorHistory as string),
          favor
        ])
      }
    });

    // Finally, charge favor points
    await chargePoints({
      where: { id: dbUser?.id, username: dbUser?.username as string },
      points: favor.favorValue
    });

    revalidatePath('/', 'layout');
    return { status: 200, message: "Favor request declined." }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "An error occurred while declining the favor request." }
  } finally {
    prisma.$disconnect();
  }
}


export const markActiveFavorReq = async ({ favor, user }: { favor: favor, user: Session["user"] | null }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to accept a favor request." };

    // Make sure the user has the favor request in their received favors
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
    if (!(JSON.parse(dbUser?.receivedFavors as string) as favor[]).some((f) => f.id === favor.id)) return { status: 404, message: "Favor request not found." };

    // Decline the favor request
    await prisma.user.update({
      where: { id: user.id },
      data: {
        receivedFavors: JSON.stringify([
          ...user.receivedFavors.filter((f) => f.id !== favor.id),
          {
            ...favor,
            working: [minifyUser(user)]
          }
        ])
      }
    });

    const sender = await prisma.user.findUnique({ where: { id: favor.sender.id }});

    await prisma.user.update({
      where: { id: favor.sender.id },
      data: {
        sentFavors: JSON.stringify([
          ...(JSON.parse(sender?.sentFavors as string) as favor[]).filter((f) => f.id !== favor.id),
          {
            ...favor,
            working: [minifyUser(user)]
          }
        ])
      }
    });

    revalidatePath('/', 'layout');
    return { status: 200, message: "Favor request accepted." }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "An error occurred while accepting the favor request." }
  } finally {
    prisma.$disconnect();
  }
}

export const completeFavorReq = async ({ favor, user, image }: { favor: favor, user: Session["user"] | null, image: { image: string, imageId: string } }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to accept a favor request." };

    // Make sure the user has the favor request in their received favors
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
    if (!(JSON.parse(dbUser?.receivedFavors as string) as favor[]).some((f) => f.id === favor.id)) return { status: 404, message: "Favor request not found." };


    // Move favor to favor history
    await prisma.user.update({
      where: { id: user.id },
      data: {
        receivedFavors: JSON.stringify([
          ...(JSON.parse(dbUser?.receivedFavors as string) as favor[]).filter((f) => f.id !== favor.id),
        ]),
        favorHistory: JSON.stringify([
          ...JSON.parse(dbUser?.favorHistory as string),
          {
            ...favor,
            completed: true,
            completedAt: new Date(),
            completionImage: image.image,
            completionImageId: image.imageId
          }
        ])
      }
    });

    const sender = await prisma.user.findUnique({ where: { id: favor.sender.id }});

    await prisma.user.update({
      where: { id: favor.sender.id },
      data: {
        sentFavors: JSON.stringify([
          ...(JSON.parse(sender?.sentFavors as string) as favor[]).filter((f) => f.id !== favor.id),
        ]),
        favorHistory: JSON.stringify([
          ...JSON.parse(sender?.favorHistory as string),
          {
            ...favor,
            completed: true,
            completedAt: new Date(),
            completionImage: image.image,
            completionImageId: image.imageId
          }
        ])
      }
    });

    revalidatePath('/', 'layout');
    return { status: 200, message: "Favor request completed." }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "An error occurred while completing the favor request." }
  } finally {
    prisma.$disconnect();
  }
}