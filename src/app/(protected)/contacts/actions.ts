"use server";

import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  createContact,
  deleteContact,
  getAllContacts,
  updateContact,
} from "@/lib/db/queries/contacts";
import type { Contact } from "@/lib/db/schemas/club-share";

const contactSchema = z.object({
  contactEmail: z.email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
});

const deleteContactSchema = z.object({
  contactEmail: z.email("Invalid contact email format"),
});

const updateContactSchema = z.object({
  contactEmail: z.email("Invalid original contact email format"),
  displayName: z.string().min(1, "Display name cannot be empty").nullable(),
});

const editContactDisplayNameSchema = z.object({
  contactEmail: z.email("Invalid contact email format"),
  newDisplayName: z.string().nullable(),
});

export interface MutationActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
  message?: string;
}

export interface QueryActionState<T> {
  status: "idle" | "in_progress" | "success" | "failed";
  message?: string;
}

export async function newContact(
  _: MutationActionState,
  formData: FormData
): Promise<MutationActionState> {
  const session = await auth();

  if (session == null || !session.user?.email)
    return {
      status: "failed",
      message: "Login to perform this action",
    };

  const rawData = {
    contactEmail: formData.get("contactEmail"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  };

  const validatedData = contactSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error("Validation failed:", validatedData.error.issues);
    return {
      status: "invalid_data",
      message: "Invalid contact data provided. Please check the fields.",
    };
  }

  try {
    await createContact(
      session.user.email,
      validatedData.data.contactEmail,
      `${validatedData.data.firstName} ${validatedData.data.lastName}`.trim() // Concatenate names
    );

    return { status: "success", message: "Contact created successfully." };
  } catch (error) {
    console.error("Error creating contact:", error);
    return {
      status: "failed",
      message: "Failed to create contact. Please try again.",
    };
  }
}

export async function deleteContactAction(
  _: MutationActionState,
  formData: FormData
): Promise<MutationActionState> {
  const session = await auth();

  if (session == null || !session.user?.email)
    return {
      status: "failed",
      message: "Login to perform this action",
    };

  const validatedData = deleteContactSchema.safeParse({
    contactEmail: formData.get("contactEmail"),
  });

  if (!validatedData.success) {
    console.error("Validation failed:", validatedData.error.flatten());
    return {
      status: "invalid_data",
      message: "Invalid contact email provided.",
    };
  }

  try {
    await deleteContact(session.user.email, validatedData.data.contactEmail);
    return { status: "success", message: "Contact deleted successfully." };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return {
      status: "failed",
      message: "Failed to delete contact. Please try again.",
    };
  }
}

export async function updateContactAction(
  _: MutationActionState,
  formData: FormData
): Promise<MutationActionState> {
  const session = await auth();

  if (session == null || !session.user?.email)
    return {
      status: "failed",
      message: "Login to perform this action",
    };

  const rawData = {
    contactEmail: formData.get("contactEmail"),
    displayName: formData.get("displayName"),
  };

  const validatedData = updateContactSchema.safeParse(rawData);

  if (!validatedData.success) {
    console.error("Update validation failed:", validatedData.error.flatten());
    return {
      status: "invalid_data",
      message: `${validatedData.error.issues}`,
    };
  }

  try {
    await updateContact(
      session.user.email,
      validatedData.data.contactEmail,
      validatedData.data.displayName
    );
    return { status: "success", message: "Contact updated successfully." };
  } catch (error) {
    console.error("Error updating contact:", error);
    return {
      status: "failed",
      message: "Failed to update contact. Please try again.",
    };
  }
}

export async function getAllContactsAction(): Promise<Contact[]> {
  const session = await auth();

  if (session == null || !session.user?.email) {
    console.error("getAllContactsAction: User not authenticated");
    return [];
  }

  try {
    const contacts = await getAllContacts(session.user.email);
    return contacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw new Error("Failed to fetch contacts.");
  }
}

export async function getContactByEmailAction(
  contactEmail: string
): Promise<Contact | null> {
  const session = await auth();

  if (session == null || !session.user?.email) {
    console.error("getContactByEmailAction: User not authenticated");
    return null;
  }

  try {
    const contacts = await getAllContacts(session.user.email);
    const contact = contacts.find((c) => c.contactEmail === contactEmail);
    return contact || null;
  } catch (error) {
    console.error("Error fetching contact by email:", error);
    return null;
  }
}
