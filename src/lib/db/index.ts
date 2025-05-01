import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as authsSchemas from "./schemas/auth";
import * as clubShareSchemas from "./schemas/club-share";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

// Set your Neon connection string in the environment variable POSTGRES_URL
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const sql = neon(process.env.POSTGRES_URL!);

export const db = drizzle(sql, {
  schema: { ...clubShareSchemas, ...authsSchemas },
});
