'use server';

import { z } from 'zod';
import { auth } from '@/app/(auth)/auth';
import {
  createClub,
  deleteClub,
  getOwnedClubs,
  isClubOwner,
  getAllMemberClubs,
  getClubDetailsById,
  type ClubDetails,
  getClubEditDataById,
} from '@/lib/db/queries/clubs';
import type { Club, Contact } from '@/lib/db/schemas/club-share';
import { getContactsForSharing } from '@/lib/db/queries/contacts';
import { getGroupsForSharing } from '@/lib/db/queries/groups';

export interface MutationActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'invalid_data'
    | 'unauthorized';
  message?: string;
}

const createClubSchema = z.object({
  name: z.string().min(1, 'Club name cannot be empty'),
  details: z.string().optional().default('{}'),
  contacts: z.array(z.string()).optional().default([]),
  groups: z.array(z.string()).optional().default([]),
  memberEmails: z.array(z.string()).optional().default([]),
});

const deleteClubSchema = z.object({
  clubId: z.uuid('Invalid club ID format'),
});

export async function newClubAction(
  _: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: 'failed', message: 'Login to perform this action' };
  }
  const userEmail = session.user.email;

  const rawData = {
    name: formData.get('name'),
    details: formData.get('details'),
    memberEmails: formData.getAll('memberEmails'),
  };

  const validatedData = createClubSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error(validatedData.error.issues);
    return {
      status: 'invalid_data',
      message: `Invalid club data: ${validatedData.error.issues}`,
    };
  }

  try {
    const { name, details: detailsString, memberEmails } = validatedData.data;

    let details = {};
    try {
      details = JSON.parse(detailsString || '{}');
    } catch (e) {
      console.error('Failed to parse club details JSON:', e);
      return { status: 'invalid_data', message: 'Invalid details format.' };
    }

    await createClub(name, userEmail, memberEmails, details);

    return { status: 'success', message: 'Club created successfully.' };
  } catch (error) {
    console.error('Error creating club:', error);
    return {
      status: 'failed',
      message: 'Failed to create club. Please try again.',
    };
  }
}

export async function deleteClubAction(
  _: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: 'failed', message: 'Login to perform this action' };
  }
  const userEmail = session.user.email;

  const validatedData = deleteClubSchema.safeParse({
    clubId: formData.get('clubId'),
  });

  if (!validatedData.success) {
    console.error('Validation failed:', validatedData.error.flatten());
    return {
      status: 'invalid_data',
      message: `${validatedData.error.issues}`,
    };
  }

  const { clubId } = validatedData.data;

  try {
    const ownerCheck = await isClubOwner(userEmail, clubId);
    if (!ownerCheck) {
      return {
        status: 'unauthorized',
        message: 'You do not have permission to delete this club.',
      };
    }

    await deleteClub(clubId, userEmail);
    return { status: 'success', message: 'Club deleted successfully.' };
  } catch (error) {
    console.error('Error deleting club:', error);
    if (error instanceof Error && error.message.includes('authorized')) {
      return { status: 'unauthorized', message: error.message };
    }
    return {
      status: 'failed',
      message: 'Failed to delete club. Please try again.',
    };
  }
}

export async function getOwnedClubsAction(): Promise<Club[]> {
  const session = await auth();
  if (!session?.user?.email) {
    console.error('getOwnedClubsAction: User not authenticated');
    return [];
  }

  try {
    const clubs = await getOwnedClubs(session.user.email);
    return clubs;
  } catch (error) {
    console.error('Error fetching owned clubs:', error);
    // Consider how to handle errors in query actions - perhaps return an object with status?
    // For now, re-throwing or returning empty array.
    return [];
  }
}

export async function getAllMemberClubsAction(): Promise<ClubDetails[]> {
  const session = await auth();
  if (!session?.user?.email) {
    console.error('getAllMemberClubsAction: User not authenticated');
    return [];
  }

  try {
    const clubs = await getAllMemberClubs(session.user.email);
    return clubs;
  } catch (error) {
    console.error('Error fetching member clubs:', error);
    return [];
  }
}

// Action to get club details (can be used by the page component)
export async function getClubDetailsAction(clubId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    console.error('getClubDetailsAction: User not authenticated');
    return null;
  }
  const userEmail = session.user.email;

  try {
    const clubDetails = await getClubDetailsById(clubId, userEmail);

    return clubDetails; // Contains club, ownerEmail, isOwner
  } catch (error) {
    console.error(`Failed to get details for club ${clubId}:`, error);
    // Depending on requirements, might return null or rethrow
    return null;
  }
}

export async function getClubSharingOptionsAction() {
  const session = await auth();

  if (!session?.user?.email) {
    console.error('getAllMemberClubsAction: User not authenticated');
    return [];
  }
  const userEmail = session.user.email;

  try {
    const [contacts, groups] = await Promise.all([
      getContactsForSharing(userEmail),
      getGroupsForSharing(userEmail),
    ]);

    return [contacts, groups] as const;
  } catch (error) {
    console.error('Error fetching member clubs:', error);
    return [];
  }
}

const updateClubSchema = z.object({
  clubId: z.uuid('Invalid club ID format'),
  name: z.string().min(1, 'Club name cannot be empty'),
  details: z.string().optional().default('{}'), // Expecting JSON string for details
  memberEmails: z
    .array(z.email('Invalid member email format'))
    .optional()
    .default([]),
});

export async function updateClubAction(
  _: MutationActionState,
  formData: FormData,
): Promise<MutationActionState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: 'failed', message: 'Login to perform this action' };
  }
  const userEmail = session.user.email;

  const rawData = {
    clubId: formData.get('clubId'),
    name: formData.get('name'),
    details: formData.get('details'),
    memberEmails: formData.getAll('memberEmails'),
  };

  const validatedData = updateClubSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error('Validation failed:', validatedData.error.flatten());
    return {
      status: 'invalid_data',
      message: `Invalid club data: ${validatedData.error.issues}`,
    };
  }

  const {
    clubId,
    name,
    details: detailsString,
    memberEmails,
  } = validatedData.data;

  try {
    const ownerCheck = await isClubOwner(userEmail, clubId);
    if (!ownerCheck) {
      return {
        status: 'unauthorized',
        message: 'You do not have permission to edit this club.',
      };
    }

    let details = {};
    try {
      details = JSON.parse(detailsString || '{}');
    } catch (e) {
      console.error('Failed to parse club details JSON:', e);
      return { status: 'invalid_data', message: 'Invalid details format.' };
    }

    // Recreate the club with updated info
    await createClub(name, userEmail, memberEmails, details);
    // Delete the old club
    await deleteClub(clubId, userEmail);

    return { status: 'success', message: 'Club updated successfully.' };
  } catch (error) {
    console.error('Error updating club:', error);
    if (error instanceof Error && error.message.includes('authorized')) {
      return { status: 'unauthorized', message: error.message };
    }
    return {
      status: 'failed',
      message: 'Failed to update club. Please try again.',
    };
  }
}

export async function clubEditDataAction(clubId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { status: 'failed', message: 'Login to perform this action' };
  }
  const userEmail = session.user.email;

  try {
    const ownerCheck = await isClubOwner(userEmail, clubId);
    if (!ownerCheck) {
      return {
        status: 'unauthorized',
        message: 'You do not have permission to edit this club.',
      };
    }

    const clubData = await getClubEditDataById(clubId, userEmail);

    return clubData;
  } catch (error) {
    console.error('Error updating club:', error);
    if (error instanceof Error && error.message.includes('authorized')) {
      return { status: 'unauthorized', message: error.message };
    }
    return {
      status: 'failed',
      message: 'Failed to update club. Please try again.',
    };
  }
}

export type ContactWithChecked = Contact & { checked: boolean };
