"use server";

import { eq, and, inArray, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  clubs,
  clubOwners,
  clubMembers,
  type Club,
  contacts,
} from "../schemas/club-share";
import { users } from "@/lib/db/schemas/auth";

/**
 * Checks if a user is an owner of a specific club.
 * @param userEmail The email of the user.
 * @param clubId The ID of the club.
 * @returns A promise that resolves with true if the user is an owner, false otherwise.
 */
export async function isClubOwner(
  userEmail: string,
  clubId: string
): Promise<boolean> {
  try {
    const result = await db
      .select()
      .from(clubOwners)
      .where(
        and(eq(clubOwners.clubId, clubId), eq(clubOwners.userEmail, userEmail))
      )
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error("Failed to check club ownership in database", error);
    throw error;
  }
}

/**
 * Creates a new club and assigns the initial owner and members based on provided emails.
 * @param name The name of the club.
 * @param ownerEmail The email of the initial owner.
 * @param memberEmails An array of emails for all members to be added.
 * @param details Optional additional details for the club.
 * @returns A promise that resolves with the newly created club.
 */
export async function createClub(
  name: string,
  ownerEmail: string,
  memberEmails: string[] = [],
  details: Record<string, string> = {}
): Promise<Club> {
  try {
    const [newClub] = await db
      .insert(clubs)
      .values({ name, details })
      .returning();
    const clubId = newClub.id;

    await db.insert(clubOwners).values({
      clubId,
      userEmail: ownerEmail,
    });

    const uniqueMemberEmailsSet = new Set(memberEmails);
    uniqueMemberEmailsSet.delete(ownerEmail);

    if (uniqueMemberEmailsSet.size > 0) {
      const memberInserts = Array.from(uniqueMemberEmailsSet).map((email) => ({
        clubId,
        userEmail: email,
      }));
      await db.insert(clubMembers).values(memberInserts);
    }

    return newClub;
  } catch (error) {
    console.error("Failed to create club in database", error);
    throw error;
  }
}

/**
 * Deletes a club.
 * Requires the user performing the deletion to be an owner.
 * @param clubId The ID of the club to delete.
 * @param userEmail The email of the user attempting the deletion.
 * @returns A promise that resolves when the club is deleted.
 */
export async function deleteClub(
  clubId: string,
  userEmail: string
): Promise<void> {
  try {
    const ownerCheck = await isClubOwner(userEmail, clubId);
    if (!ownerCheck) {
      throw new Error("User is not authorized to delete this club.");
    }
    await db.delete(clubs).where(eq(clubs.id, clubId));
  } catch (error) {
    console.error("Failed to delete club from database", error);
    if (error instanceof Error && error.message.includes("authorized")) {
      throw error;
    }
    throw new Error("Failed to delete club.");
  }
}

/**
 * Retrieves all clubs where the specified user is an owner.
 * @param userEmail The email of the user.
 * @returns A promise that resolves with an array of Club objects.
 */
export async function getOwnedClubs(userEmail: string): Promise<ClubDetails[]> {
  try {
    const ownedClubs = await db
      .select({
        id: clubOwners.clubId,
        name: clubs.name,
        details: clubs.details,
        ownerEmail: clubOwners.userEmail,
      })
      .from(clubOwners)
      .innerJoin(clubs, eq(clubOwners.clubId, clubs.id))
      .where(eq(clubOwners.userEmail, userEmail));

    return ownedClubs;
  } catch (error) {
    console.error("Failed to get owned clubs for user from database", error);
    throw error;
  }
}

// export interface ClubDetailsData {
//   email: string;
//   phone: string;
//   id: string;
//   password: string;
//   username: string;
//   [customFielName: string]: string;
// }

export type ClubDetails = {
  id: string;
  name: string;
  details: Record<string, string>; // Changed from JSON to Record<string, string>
  ownerEmail: string;
};
/**
 * Retrieves all clubs where the specified user is a member.
 * @param userEmail The email of the user.
 * @returns A promise that resolves with an array of Club objects.
 */
export async function getAllMemberClubs(
  userEmail: string
): Promise<ClubDetails[]> {
  try {
    const memberClubsQuery = db
      .select({
        id: clubs.id,
        details: clubs.details,
        name: clubs.name,
        ownerEmail: clubOwners.userEmail,
      })
      .from(clubMembers)
      .innerJoin(clubs, eq(clubMembers.clubId, clubs.id))
      .innerJoin(clubOwners, eq(clubMembers.clubId, clubOwners.clubId))
      .where(eq(clubMembers.userEmail, userEmail));

    const ownerClubsQuery = db
      .select({
        id: clubs.id,
        details: clubs.details,
        name: clubs.name,
        ownerEmail: clubOwners.userEmail,
      })
      .from(clubOwners)
      .innerJoin(clubs, eq(clubOwners.clubId, clubs.id))
      .where(eq(clubOwners.userEmail, userEmail));

    const [memberClubs, ownerClubs] = await Promise.all([
      memberClubsQuery,
      ownerClubsQuery,
    ]);

    const accesibleClubs = [...memberClubs, ...ownerClubs];

    return accesibleClubs;
  } catch (error) {
    console.error("Failed to get all clubs for user from database", error);
    throw error;
  }
}

/**
 * Retrieves all clubs where the specified user is either an owner or a member.
 * @param userEmail The email of the user.
 * @returns A promise that resolves with an array of Club objects.
 */
export async function getAllClubsForUser(userEmail: string): Promise<Club[]> {
  try {
    const ownedClubsQuery = db
      .select({ id: clubOwners.clubId })
      .from(clubOwners)
      .where(eq(clubOwners.userEmail, userEmail));

    const memberClubsQuery = db
      .select({ id: clubMembers.clubId })
      .from(clubMembers)
      .where(eq(clubMembers.userEmail, userEmail));

    const [ownedClubs, memberClubs] = await Promise.all([
      ownedClubsQuery,
      memberClubsQuery,
    ]);

    const clubIds = [
      ...new Set([
        ...ownedClubs.map((c) => c.id),
        ...memberClubs.map((c) => c.id),
      ]),
    ];

    if (clubIds.length === 0) {
      return [];
    }

    return await db.select().from(clubs).where(inArray(clubs.id, clubIds));
  } catch (error) {
    console.error("Failed to get all clubs for user from database", error);
    throw error;
  }
}

export type ClubDetailsWithOwnership = {
  club: Club;
  ownerEmail: string;
  isOwner: boolean;
};

/**
 * Retrieves details for a specific club, including its owner and whether the requesting user is the owner.
 * @param clubId The ID of the club.
 * @param userEmail The email of the user requesting the details (to check ownership).
 * @returns A promise that resolves with the club details and ownership status, or null if not found.
 */
export async function getClubDetailsById(
  clubId: string,
  userEmail: string
): Promise<ClubDetailsWithOwnership | null> {
  try {
    const result = await db
      .select({
        club: clubs,
        ownerEmail: clubOwners.userEmail,
      })
      .from(clubs)
      .innerJoin(clubOwners, eq(clubs.id, clubOwners.clubId))
      .where(eq(clubs.id, clubId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const { club, ownerEmail } = result[0];

    const isOwner = ownerEmail === userEmail;

    return {
      club,
      ownerEmail,
      isOwner,
    };
  } catch (error) {
    console.error("Failed to get club details by ID from database", error);
    throw error;
  }
}

export type EditSharedWithItem = {
  email: string;
  name: string;
  image: string | null;
  isShared: boolean;
};

export async function getClubEditDataById(clubId: string, userEmail: string) {
  try {
    const result = await db
      .select({
        club: clubs,
      })
      .from(clubs)
      .innerJoin(clubOwners, eq(clubs.id, clubOwners.clubId))
      .where(eq(clubs.id, clubId))
      .limit(1);

    const { club } = result[0];

    const clubMembersEmailsResult = await db
      .select({
        email: clubMembers.userEmail,
      })
      .from(clubMembers)
      .where(
        and(
          eq(clubMembers.clubId, clubId),
          ne(clubMembers.userEmail, userEmail)
        )
      );

    const memberEmails = new Set(clubMembersEmailsResult.map((m) => m.email));

    const contactsWithUserInfo = await db
      .select({
        email: contacts.contactEmail,
        contactName: contacts.displayName,
        userName: users.name,
        image: users.image,
      })
      .from(contacts)
      .leftJoin(users, eq(contacts.contactEmail, users.email))
      .where(eq(contacts.userEmail, userEmail));

    const uniqueIndividuals = new Map();

    contactsWithUserInfo.forEach((contact) => {
      uniqueIndividuals.set(contact.email, {
        email: contact.email,
        name: contact.contactName || contact.userName || contact.email,
        image: contact.image,
        isShared: memberEmails.has(contact.email),
      });
    });

    memberEmails.forEach((memberEmail) => {
      if (!uniqueIndividuals.has(memberEmail)) {
        uniqueIndividuals.set(memberEmail, {
          email: memberEmail,
          name: memberEmail,
          image: null,
          isShared: true,
        });
      }
    });

    const sharedWith: EditSharedWithItem[] = Array.from(
      uniqueIndividuals.values()
    );

    return {
      sharedWith,
      club,
    };
  } catch (error) {
    console.error("Failed to get club details by ID from database", error);
    throw error;
  }
}
