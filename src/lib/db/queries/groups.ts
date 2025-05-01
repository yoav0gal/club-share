"use server";

import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  groups,
  groupOwners,
  groupMembers,
  type Group,
} from "../schemas/club-share";
import { users } from "../schemas/auth";

/**
 * Checks if a user is an owner of a specific group.
 * @param userEmail The email of the user.
 * @param groupId The ID of the group.
 * @returns A promise that resolves with true if the user is an owner, false otherwise.
 */
export async function isGroupOwner(
  userEmail: string,
  groupId: string
): Promise<boolean> {
  try {
    const result = await db
      .select()
      .from(groupOwners)
      .where(
        and(
          eq(groupOwners.groupId, groupId),
          eq(groupOwners.userEmail, userEmail)
        )
      )
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error("Failed to check group ownership in database", error);
    throw error;
  }
}

/**
 * Creates a new group and assigns initial owners and members.
 * @param name The name of the group.
 * @param ownerEmails An array of emails for the initial owners.
 * @param memberEmails An array of emails for the initial members.
 * @returns A promise that resolves with the newly created group ID.
 */
export async function createGroup(
  name: string,
  ownerEmails: string[],
  memberEmails: string[]
): Promise<string> {
  try {
    const [newGroup] = await db
      .insert(groups)
      .values({ name })
      .returning({ id: groups.id });
    const groupId = newGroup.id;

    const allMemberEmails = [...new Set([...ownerEmails, ...memberEmails])];

    if (ownerEmails.length > 0) {
      const ownerInserts = ownerEmails.map((email) => ({
        groupId,
        userEmail: email,
      }));
      await db.insert(groupOwners).values(ownerInserts);
    }

    if (allMemberEmails.length > 0) {
      const memberInserts = allMemberEmails.map((email) => ({
        groupId,
        userEmail: email,
      }));
      await db.insert(groupMembers).values(memberInserts);
    }

    return groupId;
  } catch (error) {
    console.error("Failed to create group in database", error);
    throw error;
  }
}

/**
 * Updates a group's name, owners, and members.
 * Requires the user performing the update to be an owner.
 * @param groupId The ID of the group to update.
 * @param name The new name for the group.
 * @param ownerEmails The complete list of emails for the owners.
 * @param memberEmails The complete list of emails for the members.
 * @returns A promise that resolves when the group is updated.
 */
export async function updateGroup(
  groupId: string,
  name: string,
  ownerEmails: string[],
  memberEmails: string[]
): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(groups)
        .set({ name, updatedAt: new Date() })
        .where(eq(groups.id, groupId));

      const allMemberEmails = [...new Set([...ownerEmails, ...memberEmails])];

      await tx.delete(groupOwners).where(eq(groupOwners.groupId, groupId));
      if (ownerEmails.length > 0) {
        const ownerInserts = ownerEmails.map((email) => ({
          groupId,
          userEmail: email,
        }));
        await tx.insert(groupOwners).values(ownerInserts);
      }

      await tx.delete(groupMembers).where(eq(groupMembers.groupId, groupId));
      if (allMemberEmails.length > 0) {
        const memberInserts = allMemberEmails.map((email) => ({
          groupId,
          userEmail: email,
        }));
        await tx.insert(groupMembers).values(memberInserts);
      }
    });
  } catch (error) {
    console.error("Failed to update group in database", error);
    throw error;
  }
}

/**
 * Deletes a group.
 * Requires the user performing the deletion to be an owner.
 * @param groupId The ID of the group to delete.
 * @returns A promise that resolves when the group is deleted.
 */
export async function deleteGroup(groupId: string): Promise<void> {
  try {
    // Cascade delete should handle owners and members due to schema constraints
    await db.delete(groups).where(eq(groups.id, groupId));
  } catch (error) {
    console.error("Failed to delete group from database", error);
    throw error;
  }
}

/**
 * Retrieves all groups where the specified user is either an owner or a member.
 * @param userEmail The email of the user.
 * @returns A promise that resolves with an array of Group objects.
 */
export async function getAllGroupsForUser(
  userEmail: string
): Promise<(Group & { members: Array<{ email: string }> })[]> {
  try {
    const ownedGroupsQuery = db
      .select({ id: groupOwners.groupId })
      .from(groupOwners)
      .where(eq(groupOwners.userEmail, userEmail));

    const memberGroupsQuery = db
      .select({ id: groupMembers.groupId })
      .from(groupMembers)
      .where(eq(groupMembers.userEmail, userEmail));

    const [ownedGroups, memberGroups] = await Promise.all([
      ownedGroupsQuery,
      memberGroupsQuery,
    ]);

    const groupIds = [
      ...new Set([
        ...ownedGroups.map((g) => g.id),
        ...memberGroups.map((g) => g.id),
      ]),
    ];

    if (groupIds.length === 0) {
      return [];
    }

    const userGroups = await db
      .select()
      .from(groups)
      .where(inArray(groups.id, groupIds));

    // Fetch members for each group
    const groupsWithMembers = await Promise.all(
      userGroups.map(async (group) => {
        const members = await db
          .select({ email: groupMembers.userEmail })
          .from(groupMembers)
          .where(eq(groupMembers.groupId, group.id));
        return { ...group, members };
      })
    );

    return groupsWithMembers;
  } catch (error) {
    console.error("Failed to get groups for user from database", error);
    throw error;
  }
}

/**
 * Retrieves detailed information about a specific group, including its owners and members.
 * @param groupId The ID of the group.
 * @returns A promise that resolves with the group details or null if not found.
 */
export async function getGroupDetails(groupId: string): Promise<{
  group: Group;
  owners: { email: string; name: string | null; image: string | null }[];
  members: { email: string }[];
} | null> {
  try {
    const groupQuery = db
      .select()
      .from(groups)
      .where(eq(groups.id, groupId))
      .limit(1);
    const ownersQuery = db
      .select({
        email: users.email,
        name: users.name,
        image: users.image,
      })
      .from(groupOwners)
      .innerJoin(users, eq(groupOwners.userEmail, users.email))
      .where(eq(groupOwners.groupId, groupId));

    const membersQuery = db
      .select({
        email: groupMembers.userEmail,
      })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId));

    const [[group], owners, members] = await Promise.all([
      groupQuery,
      ownersQuery,
      membersQuery,
    ]);

    if (!group) return null;

    return {
      group,
      owners,
      members,
    };
  } catch (error) {
    console.error("Failed to get group details from database", error);
    throw error;
  }
}
