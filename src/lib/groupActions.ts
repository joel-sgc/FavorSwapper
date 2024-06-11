"use server"
import { minimalFavorGroup, minimalUser } from "@/auth";
import { revalidatePath } from "next/cache";
import prisma from "@/prisma/client";
import { Session } from "next-auth";

export const createGroup = async ({ groupName, user }: { groupName: string, user: Session["user"] }) => {
  try {
    // We allow the user to create 2 favor groups for free, after that we charge 50 favor points per favor group.
    // If a favor group is disbanded, the user does not receive those points back. In order to transfer a group, the
    // new admin must pay a 25 point fee to the owner, this is unless the owner waives this option.

    // First we check if the user is an admin of at least 2 free
    let freeUsedUp = 0;
    for (let i = 0; i < user.favorGroups.length; i++) {
      if (user.favorGroups[i].free && user.favorGroups[i].admins.some((admin) => admin.id === user.id)) {
        // Check DB to be sure
        const group = await prisma.favorGroup.findUnique({ where: { id: user.favorGroups[i].id }});

        // If group not found
        if (!group) {
          return { status: 500, message: "Something went wrong, please try again later."};
        }

        const isAdmin = (JSON.parse(group.admins) as minimalUser[]).some((admin) => admin.id === user.id);
        const isGroupFree = group.free;
        
        if (isAdmin && isGroupFree) freeUsedUp++;
        else if (!group?.free || !isAdmin) {
          // In case that for some reason the user-data doesn't natch the db data (isAdmin/isGroupFree), we fix the error.
          user.favorGroups[i].admins = JSON.parse(group.admins);
          
          await prisma.user.update({
            where: { id: user.id },
            data: { favorGroups: group.admins }
          });
        }
      }
    }

    // If we have less than 2 free used up favor groups, we create the favor group for free. If not, we try to charge 50 favor points
    if (freeUsedUp === 2) {
      // Check if we really do have 50
      const dbUser = await prisma.user.findUnique({ where: { id: user.id }});
      if ((dbUser?.favorPoints as number) >= 50) {
        user.favorPoints -= 50;

        await prisma.user.update({
          where: { id: user.id },
          data: { favorPoints: user.favorPoints }
        });
      } else return { status: 500, message: "Insufficient funds :(" };
    }


    const newGroup = await prisma.favorGroup.create({ data: {
      name: groupName,
      admins: JSON.stringify([{
        id: user.id,
        name: user.name,
        image: user.image,
        username: user.username
      } as minimalUser ]),
      members: JSON.stringify([{
        id: user.id,
        name: user.name,
        image: user.image,
        username: user.username
      } as minimalUser ]),
      free: true
    }});

    await prisma.user.update({
      where: { id: user.id },
      data: {
        favorGroups: JSON.stringify([
          ...user.favorGroups as minimalFavorGroup[],
          {
            id: newGroup.id,
            name: groupName,
            free: freeUsedUp < 2,
            admins: [{
              id: user.id,
              name: user.name,
              image: user.image,
              username: user.username
            }],
          }
        ])
      }
    })

    revalidatePath('/groups');
    return { status: 200, message: "Group created successfuly!" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong, please try again later." };    
  } finally {
    prisma.$disconnect();
  }
}

export const addToGroup = async ({ groupId, username, user }: { groupId: string, username: string, user: Session["user"] | null }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to add a user to a group." };

    // Check if group exists
    const group = await prisma.favorGroup.findUnique({ where: { id: groupId }});
    if (!group) return { status: 404, message: "Group not found." };

    // Check if new user exists
    const userToAdd = await prisma.user.findFirst({ where: { username }});
    if (!userToAdd) return { status: 404, message: "User not found." };

    // Check if user is an admin of the group
    if (!(JSON.parse(group.admins) as minimalUser[]).some((admin) => admin.id === user.id)) return { status: 403, message: "You must be an admin of the group to add a user." };

    // Check if new user is already in the group
    if ((JSON.parse(group.members) as minimalUser[]).some((member) => member.id === userToAdd.id)) return { status: 400, message: "User is already in the group." };

    // Add new user to group's DB data
    await prisma.favorGroup.update({
      where: { id: groupId },
      data: { members: JSON.stringify([
        ...JSON.parse(group.members),
        {
          id: userToAdd.id,
          name: userToAdd.name,
          image: userToAdd.image,
          username: userToAdd.username
        }
      ])}
    });

    // Add group to new user's DB data
    await prisma.user.update({
      where: { username },
      data: {
        favorGroups: JSON.stringify([
          ...JSON.parse(userToAdd.favorGroups),
          {
            id: groupId,
            name: group.name,
            free: group.free,
            admins: JSON.parse(group.admins)
          }
        ])
      }
    })

    revalidatePath('/groups', 'layout');

    return { status: 200, message: "User added to group." };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong, please try again later." };
  } finally {
    prisma.$disconnect();
  }
}

export const updateGroup = async ({ groupId, data, user }: { groupId: string, data: { name?: string, image?: string, imageDelUrl?: string }, user: Session["user"] }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to update a group." };

    // Check if group exists
    const group = await prisma.favorGroup.findUnique({ where: { id: groupId }});
    if (!group) return { status: 404, message: "Group not found." };

    // Check if user is an admin of the group
    if (!(JSON.parse(group.admins) as minimalUser[]).some((admin) => admin.id === user.id)) return { status: 403, message: "You must be an admin of the group to update it." };

    // Update group
    await prisma.favorGroup.update({
      where: { id: groupId },
      data: {
        name: data.name ?? group.name,
        image: data.image ?? group.image,
        imageDelUrl: data.imageDelUrl ?? group.imageDelUrl
      }
    });

    revalidatePath('/groups', 'layout');
    return { status: 200, message: "Group updated." };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong, please try again later." };
  } finally {
    prisma.$disconnect();
  }
}

export const deleteGroup = async ({ groupId, user }: { groupId: string, user: Session["user"] }) => {
  try {
    // Check if user is logged in
    if (!user) return { status: 401, message: "You must be logged in to delete a group." };

    // Check if group exists
    const group = await prisma.favorGroup.findUnique({ where: { id: groupId }});
    if (!group) return { status: 404, message: "Group not found." };

    // Check if user is an admin of the group
    if (!(JSON.parse(group.admins) as minimalUser[]).some((admin) => admin.id === user.id)) return { status: 403, message: "You must be an admin of the group to delete it." };

    // Delete group
    await prisma.favorGroup.delete({ where: { id: groupId }});

    const groupUsers = await prisma.user.findMany({ where: { id: { in: (JSON.parse(group.members) as minimalUser[]).map((m) => m.id ) }}})
    const updatePromises = groupUsers.map((user) => {
      const data = (JSON.parse(user.favorGroups) as minimalFavorGroup[]).filter((group) => group.id !== groupId);

      if (data) {
        return prisma.user.update({
          where: { id: user.id },
          data: {
            favorGroups: JSON.stringify(data)
          }
        })
      }
    });

    await Promise.all(updatePromises);

    revalidatePath('/groups', 'layout');
    return { status: 200, message: "Group deleted." };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong, please try again later." };
  } finally {
    prisma.$disconnect();
  }

}