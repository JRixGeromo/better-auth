import { drizzle } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';
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

// Create drizzle database instance with schema
export const db = drizzle(client, { schema });

// Set up query builder
const queries = {
  user: {
    findFirst: async (args: { where: any }) => {
      const result = await db.select().from(schema.user).where(args.where).limit(1);
      return result[0];
    },
    findMany: async (args: { where: any }) => {
      return await db.select().from(schema.user).where(args.where);
    }
  },
  session: {
    findFirst: async (args: { where: any }) => {
      const result = await db.select().from(schema.session).where(args.where).limit(1);
      return result[0];
    },
    findMany: async (args: { where: any }) => {
      return await db.select().from(schema.session).where(args.where);
    }
  },
  verification: {
    findFirst: async (args: { where: any }) => {
      const result = await db.select().from(schema.verification).where(args.where).limit(1);
      return result[0];
    },
    findMany: async (args: { where: any }) => {
      return await db.select().from(schema.verification).where(args.where);
    }
  },
  account: {
    findFirst: async (args: { where: any }) => {
      const result = await db.select().from(schema.account).where(args.where).limit(1);
      return result[0];
    },
    findMany: async (args: { where: any }) => {
      return await db.select().from(schema.account).where(args.where);
    }
  }
};

// Add query builder to db instance
(db as any).query = queries;

// Export schema for convenience
export { schema };
