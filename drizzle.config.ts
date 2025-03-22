import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

// Parse connection URL for credentials
const dbUrl = new URL(process.env.BETTER_AUTH_DATABASE_URL || '');

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port || '5432'),
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1), // Remove leading slash
    ssl: {
      rejectUnauthorized: false
    }
  }
} satisfies Config;
