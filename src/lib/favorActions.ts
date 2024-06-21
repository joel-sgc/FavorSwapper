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

      await prisma.favorGroup.update({
        where: { id: favor.groupId },
        data: {
          favors: JSON.stringify([
            ...JSON.parse(recipient.favors),
            {
              ...favor,
              ignoring: [],
              working: [],
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
    if (favor.receiver?.id !== user?.id && (favor.groupId && !user.favorGroups.includes(favor.groupId))) return { status: 403, message: "You can't accept a favor request that isn't addressed to you." };

    const dbUser = await prisma.user.findUnique({ where: { id: user.id }});

    // Make sure user has required favor points to decline the favor
    if (favor.favorValue > (dbUser?.favorPoints as number)) return { status: 401, message: "Insufficient funds" };

    // Decline the favor request
    await prisma.user.update({
      where: { id: user.id },
      data: {
        receivedFavors: JSON.stringify((JSON.parse(dbUser?.receivedFavors as string) as favor[]).filter((f) => f.id !== favor.id))
      }
    });

    if (favor.groupId) {
      const group = await prisma.favorGroup.findUnique({ where: { id: favor.groupId }});

      await prisma.favorGroup.update({
        where: { id: favor.groupId },
        data: {
          favors: JSON.stringify([
            ...(JSON.parse(group?.favors as string) as favor[]).filter((f) => f.id !== favor.id),
            {
              ...favor,
              ignoring: [
                ...(favor.ignoring as minimalUser[]).filter((u) => u.id !== user.id),
                minifyUser(user)
              ],
              working: [
                ...(favor.working as minimalUser[]).filter((u) => u.id !== user.id)
              ]
            }
          ])
        }
      });
    } else {
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
    }


    revalidatePath('/', 'layout');
    return { status: 200, message: "Favor request declined." }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "An error occurred while declining the favor request." }
  } finally {
    prisma.$disconnect();
  }
}

export const acceptFavorReq = async ({ favor, user }: { favor: favor, user: Session["user"] | null }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to accept a favor request." };

    // Make sure the user has the favor request in their received favors
    if (favor.receiver?.id !== user?.id && (favor.groupId && !user.favorGroups.includes(favor.groupId))) return { status: 403, message: "You can't accept a favor request that isn't addressed to you." };

    // Accept the favor request
    // We don't update the user if the favor is a group favor because the favor data is retrieved from the group
    if (favor.groupId) {
      const group = await prisma.favorGroup.findUnique({ where: { id: favor.groupId }});

      await prisma.favorGroup.update({
        where: { id: favor.groupId },
        data: {
          favors: JSON.stringify([
            ...(JSON.parse(group?.favors as string) as favor[]).filter((f) => f.id !== favor.id),
            {
              ...favor,
              working: [...favor.working as minimalUser[], minifyUser(user)],
              ignoring: [...(favor.ignoring as minimalUser[]).filter((u) => u.id !== user.id)]
            }
          ])
        }
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          receivedFavors: JSON.stringify([
            ...user.receivedFavors.filter((f) => f.id !== favor.id),
            {
              ...favor,
              working: [minifyUser(user)],
              ignoring: [...(favor.ignoring as minimalUser[]).filter((u) => u.id !== user.id)]
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
    }


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

export const ignoreFavorReq = async ({ favor, user }: { favor: favor, user: Session["user"] | null }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to ignore a favor request." };

    const group = await prisma.favorGroup.findUnique({ where: { id: favor.groupId }});
    const dbFavor = (JSON.parse(group?.favors as string) as favor[]).find((f) => f.id === favor.id)

    // Make sure the group exists
    if (!group) return { status: 404, message: "Group not found." };

    // Make sure the user is part of the group
    if (!(JSON.parse(group?.members as string) as minimalUser[]).some((member) => member.id === user.id)) {
      return { status: 403, message: "You must be a member of the group to ignore a favor request." };
    }

    // Ignore the favor request
    await prisma.favorGroup.update({
      where: { id: favor.groupId },
      data: {
        favors: JSON.stringify([
          ...(JSON.parse(group?.favors as string) as favor[]).filter((f) => f.id !== favor.id),
          {
            ...dbFavor,
            ignoring: [
              ...(dbFavor as favor).ignoring as minimalUser[],
              minifyUser(user)
            ]
          }
        ])
      }
    });

    return { status: 200, message: "Favor Request Ignored." }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "An error occurred while ignoring the favor." }
  } finally {
    prisma.$disconnect();
  }
}

export const cancelFavorReq = async ({ favor, user }: { favor: favor, user: Session["user"] | null }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to ignore a favor request." };

    let dbFavor = undefined as favor | undefined;
    let group = undefined as FavorGroup | undefined;

    // Check if the favor is a group favor or a user favor
    // Then verify if the user is the sender of the favor
    if (favor.groupId) {
      group = await prisma.favorGroup.findUnique({ where: { id: favor.groupId }}) as FavorGroup | undefined;
      
      // Make sure the group exists
      if (!group) return { status: 404, message: "Group not found." };
      
      const dbFavor = (JSON.parse(group?.favors as string) as favor[]).find((f) => f.id === favor.id)

      // Make sure the user is the sender of the favor
      if (dbFavor?.sender.id !== user?.id) return { status: 403, message: "You can't cancel a favor request that isn't yours." };
    } else {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
      dbFavor = (JSON.parse(dbUser?.sentFavors as string) as favor[]).find((f) => f.id === favor.id)

      // Make sure the user is the sender of the favor
      if (dbFavor?.sender.id !== user?.id) return { status: 403, message: "You can't cancel a favor request that isn't yours." };
    }

    // Check if the favor is already being worked on
    const isWorking = dbFavor?.working && dbFavor.working.length > 0;

    // Cancel the favor request, applying a penalty if the favor is already being worked on
    if (isWorking) {
      await chargePoints({
        where: { id: user.id, username: user.username as string },
        points: dbFavor?.favorValue as number
      });
    }

    if (favor.groupId) {
      await prisma.favorGroup.update({
        where: { id: group?.id },
        data: {
          favors: JSON.stringify(
            (JSON.parse(group?.favors as string) as favor[]).filter((f) => f.id !== favor.id)
          )
        }
      });
    } else {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id }});

      await prisma.user.update({
        where: { id: user.id },
        data: {
          sentFavors: JSON.stringify((JSON.parse(dbUser?.sentFavors as string) as favor[]).filter((f) => f.id !== favor.id))
        }
      });

      const receiver = await prisma.user.findUnique({ where: { id: favor.receiver?.id }});
      await prisma.user.update({
        where: { id: favor.receiver?.id },
        data: {
          receivedFavors: JSON.stringify((JSON.parse(receiver?.receivedFavors as string) as favor[]).filter((f) => f.id !== favor.id))
        }
      });
    }

    revalidatePath('/', 'layout');
    return { status: 200, message: "Favor Request Cancelled." }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "An Error Occurred While Cancelling The Favor." }
  } finally {
    prisma.$disconnect();
  }
}