import type { InferSelectModel } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  // jsonb,
  json,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const clubs = pgTable("clubs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  details: json("details").default({}).notNull().$type<Record<string, any>>(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type Club = InferSelectModel<typeof clubs>;

export const clubOwners = pgTable(
  "club_owners",
  {
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    userEmail: text("user_email")
      .notNull()
      .references(() => users.email, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.clubId, t.userEmail] })]
);

export type ClubOwner = InferSelectModel<typeof clubOwners>;

export const clubMembers = pgTable(
  "club_members",
  {
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    userEmail: text("user_email").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.clubId, t.userEmail] })]
);

export type ClubMember = InferSelectModel<typeof clubMembers>;

export const contacts = pgTable(
  "contacts",
  {
    userEmail: text("user_email")
      .notNull()
      .references(() => users.email, { onDelete: "cascade" }),
    contactEmail: text("contact_email").notNull(),
    displayName: text("display_name"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userEmail, t.contactEmail] })]
);

export type Contact = InferSelectModel<typeof contacts>;

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export type Group = InferSelectModel<typeof groups>;

export const groupOwners = pgTable(
  "group_owners",
  {
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userEmail: text("user_email").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userEmail] })]
);

export type GroupOwner = InferSelectModel<typeof groupOwners>;

export const groupMembers = pgTable(
  "group_members",
  {
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userEmail: text("user_email").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userEmail] })]
);

export type GroupMember = InferSelectModel<typeof groupMembers>;

export const groupShared = pgTable(
  "group_shared",
  {
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userEmail: text("user_email").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userEmail] })]
);

export type GroupShared = InferSelectModel<typeof groupShared>;
