import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./schema";

// Validate required environment variables
const authSecret = process.env.BETTER_AUTH_SECRET?.trim();

// Following our global rules about error handling and logging
function validateConfig(): { secret: string } {
  if (!authSecret) {
    throw new Error('❌ Missing required environment variable: BETTER_AUTH_SECRET');
  }

  return {
    secret: authSecret
  };
}

// Validate configuration
const config = validateConfig();

// Initialize BetterAuth with Drizzle adapter
export const auth = betterAuth({
  secret: config.secret,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
      session: schema.sessions
    }
  })
});
