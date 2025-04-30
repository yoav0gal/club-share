import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
  path: ['.env.local', '.env'],
});

export default defineConfig({
  schema: './src/lib/db/schemas/*',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // biome-ignore lint: Forbidden non-null assertion.
    url: process.env.POSTGRES_URL!,
  },
});
