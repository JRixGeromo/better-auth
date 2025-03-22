import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./schema";

interface UserData {
  id?: string;
  email: string;
  password?: string;
  name?: string;
  data?: any;
}

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

// Initialize BetterAuth with minimal configuration
export const auth = betterAuth({
  secret: config.secret,
  baseURL: config.appUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {  // Using schema instead of tables as per Better Auth requirements
      user: schema.users,
      session: schema.sessions,
      verification: schema.verifications,
      account: schema.accounts  // Add accounts table
    }
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 100,
    requireEmailVerification: false,
    hashPassword: true  // Let Better Auth handle password hashing
  }
});