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

// Initialize BetterAuth with drizzle adapter
export const auth = betterAuth({
  secret: config.secret,
  baseURL: config.appUrl,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users
    },
    usePlural: true
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 32,
    requireEmailVerification: false,
    hashPassword: true,
    onBeforeCreateUser: async (data: { email: string; password?: string; name?: string; data?: any }) => {
      console.log('📝 [Better Auth] Before creating user:', {
        email: data.email,
        name: data.name || data.data?.name,
        hasPassword: !!data.password,
        passwordLength: data.password?.length,
        fields: Object.keys(data),
        rawData: data,
        stack: new Error().stack
      });

      // Return minimal data to ensure password is included
      const userData = {
        email: data.email,
        password: data.password,
        name: data.name || data.data?.name || data.email.split('@')[0]
      };

      console.log('📤 [Better Auth] Returning user data:', {
        ...userData,
        hasPassword: !!userData.password,
        passwordLength: userData.password?.length,
        fields: Object.keys(userData)
      });
      return userData;
    },
    onCreateUser: async (data) => {
      console.log('✅ [Better Auth] Creating user:', {
        data,
        hasPassword: !!data.password,
        passwordLength: data.password?.length,
        fields: Object.keys(data),
        stack: new Error().stack
      });
      return data;
    }
  }
});