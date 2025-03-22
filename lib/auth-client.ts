import { createAuthClient } from "better-auth/client";

// Ensure we have a valid base URL for both development and production
const baseURL = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`
  : 'http://localhost:3000/api/auth';

console.log(' Better Auth client base URL:', baseURL);

// Create the client with just the baseURL as shown in docs
export const authClient = createAuthClient({
  baseURL
});
