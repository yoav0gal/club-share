'use server';

import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contacts, type Contact } from '../schemas/club-share';
import { users } from '../schemas/auth';

/**
 * Creates a new contact for a user.
 * @param userEmail The email of the user creating the contact.
 * @param contactEmail The email of the contact being added.
 * @param displayName An optional display name for the contact.
 * @returns A promise that resolves when the contact is created.
 */
export async function createContact(
  userEmail: string,
  contactEmail: string,
  displayName: string,
): Promise<void> {
  try {
    await db.insert(contacts).values({
      userEmail,
      contactEmail,
      displayName,
    });
  } catch (error) {
    console.error('Failed to create contact in database', error);
    throw error;
  }
}

/**
 * Deletes a contact for a specific user.
 * @param userEmail The email of the user whose contact is being deleted.
 * @param contactEmail The email of the contact to delete.
 * @returns A promise that resolves when the contact is deleted.
 */
export async function deleteContact(
  userEmail: string,
  contactEmail: string,
): Promise<void> {
  try {
    await db
      .delete(contacts)
      .where(
        and(
          eq(contacts.userEmail, userEmail),
          eq(contacts.contactEmail, contactEmail),
        ),
      );
  } catch (error) {
    console.error('Failed to delete contact from database', error);
    throw error;
  }
}

/**
 * Updates an existing contact's display name.
 * @param userEmail The email of the user whose contact is being updated.
 * @param contactEmail The email of the contact to update.
 * @param newDisplayName The new display name for the contact.
 * @returns A promise that resolves when the contact is updated.
 */
export async function updateContact(
  userEmail: string,
  contactEmail: string,
  newDisplayName: string | null,
): Promise<void> {
  try {
    await db
      .update(contacts)
      .set({ displayName: newDisplayName })
      .where(
        and(
          eq(contacts.userEmail, userEmail),
          eq(contacts.contactEmail, contactEmail),
        ),
      );
  } catch (error) {
    console.error('Failed to update contact in database', error);
    throw error;
  }
}

/**
 * Retrieves all contacts for a specific user.
 * @param userEmail The email of the user whose contacts to retrieve.
 * @returns A promise that resolves with an array of Contact objects.
 */
export async function getAllContacts(
  userEmail: string,
): Promise<Array<Contact>> {
  try {
    return await db
      .select()
      .from(contacts)
      .where(eq(contacts.userEmail, userEmail));
  } catch (error) {
    console.error('Failed to get contacts from database', error);
    throw error;
  }
}

/**
 * Retrieves a specific contact for a user by contact email.
 * @param userEmail The email of the user whose contact to retrieve.
 * @param contactEmail The email of the contact to retrieve.
 * @returns A promise that resolves with the Contact object or undefined if not found.
 */
export async function getContactByEmail(
  userEmail: string,
  contactEmail: string,
): Promise<Contact | undefined> {
  try {
    const result = await db
      .select()
      .from(contacts)
      .where(
        and(
          eq(contacts.userEmail, userEmail),
          eq(contacts.contactEmail, contactEmail),
        ),
      )
      .limit(1);
    return result[0];
  } catch (error) {
    console.error('Failed to get contact by email from database', error);
    throw error;
  }
}

export type ContactsForShare = {
  displayName: string | null;
  contactEmail: string;
  image: string | null;
};
export async function getContactsForSharing(
  userEmail: string,
): Promise<ContactsForShare[]> {
  try {
    const userContacts = await db
      .select({
        displayName: contacts.displayName,
        contactEmail: contacts.contactEmail,
        image: users.image,
      })
      .from(contacts)
      .leftJoin(users, eq(contacts.contactEmail, users.email))
      .where(eq(contacts.userEmail, userEmail));

    return userContacts;
  } catch (error) {
    console.error(
      'Failed to fetch groups and contacts for sharing in database',
      error,
    );
    throw error;
  }
}
