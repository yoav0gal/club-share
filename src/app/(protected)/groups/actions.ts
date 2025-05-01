"use server";

import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  createGroup,
  updateGroup,
  deleteGroup,
  isGroupOwner,
  getAllGroupsForUser,
  getGroupDetails,
} from "@/lib/db/queries/groups";
import type { Group } from "@/lib/db/schemas/club-share";
import { revalidatePath } from "next/cache";

export interface MutationActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data"
    | "unauthorized";
  message?: string;
}

const createGroupSchema = z.object({
  name: z.string().min(1, "Group name cannot be empty"),
  ownerEmails: z
    .array(z.email("Invalid owner email format"))
    .min(1, "At least one owner is required"),
  memberEmails: z
    .array(z.email("Invalid member email format"))
    .optional()
    .default([]),
});

const updateGroupSchema = z.object({
  groupId: z.uuid("Invalid group ID format"),
  name: z.string().min(1, "Group name cannot be empty"),
  ownerEmails: z
    .array(z.email("Invalid owner email format"))
    .min(1, "At least one owner is required"),
  memberEmails: z
    .array(z.email("Invalid member email format"))
    .optional()
    .default([]),
});

const deleteGroupSchema = z.object({
  groupId: z.uuid("Invalid group ID format"),
});

export async function newGroupAction(
  _: MutationActionState,
  formData: FormData
): Promise<MutationActionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "failed", message: "Login to perform this action" };
  }
  const userEmail = session.user.email;

  const rawData = {
    name: formData.get("name"),
    ownerEmails: [session?.user?.email],
    memberEmails: formData.getAll("memberEmails"),
  };

  if (!rawData.ownerEmails.includes(userEmail)) {
    rawData.ownerEmails.push(userEmail);
  }

  const validatedData = createGroupSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error("Validation failed:", validatedData.error.flatten());
    return {
      status: "invalid_data",
      message: `Invalid group data: 
      ${validatedData.error}
        "Unknown error"
      }`,
    };
  }

  try {
    await createGroup(
      validatedData.data.name,
      validatedData.data.ownerEmails,
      validatedData.data.memberEmails
    );
    return { status: "success", message: "Group created successfully." };
  } catch (error) {
    console.error("Error creating group:", error);
    return {
      status: "failed",
      message: "Failed to create group. Please try again.",
    };
  }
}

export async function updateGroupAction(
  _: MutationActionState,
  formData: FormData
): Promise<MutationActionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "failed", message: "Login to perform this action" };
  }
  const userEmail = session.user.email;

  const rawData = {
    groupId: formData.get("groupId"),
    name: formData.get("name"),
    ownerEmails: formData.getAll("ownerEmails"),
    memberEmails: formData.getAll("memberEmails"),
  };

  const validatedData = updateGroupSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error("Validation failed:", validatedData.error.flatten());
    return {
      status: "invalid_data",
      message: `Invalid group data:
       ${validatedData.error}
        "Unknown error"
      }`,
    };
  }

  const { groupId, name, ownerEmails, memberEmails } = validatedData.data;

  try {
    const ownerCheck = await isGroupOwner(userEmail, groupId);
    if (!ownerCheck) {
      return {
        status: "unauthorized",
        message: "You do not have permission to edit this group.",
      };
    }

    await updateGroup(groupId, name, ownerEmails, memberEmails);
    return { status: "success", message: "Group updated successfully." };
  } catch (error) {
    console.error("Error updating group:", error);
    return {
      status: "failed",
      message: "Failed to update group. Please try again.",
    };
  }
}

export async function deleteGroupAction(
  _: MutationActionState,
  formData: FormData
): Promise<MutationActionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: "failed", message: "Login to perform this action" };
  }
  const userEmail = session.user.email;

  const validatedData = deleteGroupSchema.safeParse({
    groupId: formData.get("groupId"),
  });

  if (!validatedData.success) {
    console.error("Validation failed:", validatedData.error.flatten());
    return {
      status: "invalid_data",
      message: `Invalid group ID: ${
        validatedData.error.flatten().fieldErrors.groupId?.[0] ||
        "Unknown error"
      }`,
    };
  }

  const { groupId } = validatedData.data;

  try {
    const ownerCheck = await isGroupOwner(userEmail, groupId);
    if (!ownerCheck) {
      return {
        status: "unauthorized",
        message: "You do not have permission to delete this group.",
      };
    }

    await deleteGroup(groupId);
    return { status: "success", message: "Group deleted successfully." };
  } catch (error) {
    console.error("Error deleting group:", error);
    return {
      status: "failed",
      message: "Failed to delete group. Please try again.",
    };
  }
}

export async function getAllGroupsAction(): Promise<Group[]> {
  const session = await auth();
  if (!session?.user?.email) {
    console.error("Attempted to get groups without session");
    throw new Error("Login to view groups");
  }

  try {
    return await getAllGroupsForUser(session.user.email);
  } catch (error) {
    console.error("Error fetching groups for user:", error);
    throw new Error("Failed to fetch groups.");
  }
}

export async function getGroupDetailsAction(groupId: string): Promise<{
  group: Group;
  owners: { email: string; name: string | null }[];
  members: { email: string; name: string | null }[];
  isOwner: boolean;
} | null> {
  const session = await auth();
  if (!session?.user?.email) {
    console.error("Attempted to get group details without session");
    throw new Error("Login to view group details");
  }
  const userEmail = session.user.email;

  try {
    const details = await getGroupDetails(groupId);
    if (!details) {
      return null;
    }

    const isMember = details.members.some(
      (member) => member.email === userEmail
    );
    if (!isMember) {
      console.warn(
        `User ${userEmail} attempted to access group ${groupId} they are not a member of.`
      );
      return null;
    }

    const ownerCheck = details.owners.some(
      (owner) => owner.email === userEmail
    );

    return { ...details, isOwner: ownerCheck };
  } catch (error) {
    console.error(`Error fetching details for group ${groupId}:`, error);
    throw new Error("Failed to fetch group details.");
  }
}
