import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Validate required environment variables
const dbUrl = process.env.BETTER_AUTH_DATABASE_URL?.trim();

if (!dbUrl) {
  throw new Error('❌ Missing required environment variable: BETTER_AUTH_DATABASE_URL');
}

// Create postgres client
const client = postgres(dbUrl, { 
  ssl: {
    rejectUnauthorized: false // Required for Supabase pooler's self-signed cert
  },
  max: 1, // Keep connection pool small
  idle_timeout: 0, // Disable idle timeout
  connect_timeout: 10,
  connection: {
    application_name: 'better-auth'
  }
});

// Create drizzle database instance
export const db = drizzle(client, { schema: { ...schema } });

// Export schema for convenience
export { schema };
