ALTER TABLE "group_members" DROP CONSTRAINT "group_members_user_email_users_email_fk";
--> statement-breakpoint
ALTER TABLE "group_owners" DROP CONSTRAINT "group_owners_user_email_users_email_fk";
--> statement-breakpoint
ALTER TABLE "group_shared" DROP CONSTRAINT "group_shared_user_email_users_email_fk";
