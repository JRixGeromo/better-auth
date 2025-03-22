'use client';

import { createAuthClient, type AuthError } from "better-auth/react";
import { PropsWithChildren } from "react";

// Initialize auth client with proper error handling
export const { Provider: AuthProvider, useAuth } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  onError: (error: AuthError) => {
    console.error('[Auth Error]:', error.message);
    // Following global error handling rules
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Auth Debug]:', error);
    }
  }
});
