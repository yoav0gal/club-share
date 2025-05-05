ALTER TABLE "clubs" ALTER COLUMN "details" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "clubs" ALTER COLUMN "details" SET DEFAULT '{}'::json;