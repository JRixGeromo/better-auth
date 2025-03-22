import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Initialize postgres client with pooler connection
const sql = postgres(process.env.BETTER_AUTH_DATABASE_URL!, { 
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

// Initialize Drizzle with the postgres client
export const db = drizzle(sql);
