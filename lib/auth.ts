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
  session: {
    modelName: 'session',
    fields: {
      token: 'token',
      userId: 'userId',
      expiresAt: 'expiresAt',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      ipAddress: 'ipAddress',
      userAgent: 'userAgent'
    },
    cookie: {
      name: 'session',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 100,
    requireEmailVerification: true,
    sendVerificationEmail: async ({ user, verificationToken }: { user: any; verificationToken: string }) => {
      // For now, just log the verification token
      console.log('Verification token for', user.email, ':', verificationToken);
    }
  }
});
