import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./schema";

// Validate required environment variables
const authSecret = process.env.BETTER_AUTH_SECRET?.trim();
const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000';

// Following our global rules about error handling and logging
function validateConfig(): { secret: string; appUrl: string } {
  if (!authSecret) {
    throw new Error('❌ Missing required environment variable: BETTER_AUTH_SECRET');
  }

  return {
    secret: authSecret,
    appUrl
  };
}

// Validate configuration
const config = validateConfig();

// Initialize BetterAuth with Drizzle adapter
export const auth = betterAuth({
  secret: config.secret,
  baseURL: config.appUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
      session: schema.sessions,
      verification: schema.emailVerification
    }
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false
  }
});
