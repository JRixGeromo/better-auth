"use client";

import { useAuth } from "better-auth/react";
import { useState } from "react";

export default function AuthButtons() {
  const { session, signIn, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      console.error('[Auth Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out');
      console.error('[Auth Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="text-red-500 bg-red-50 p-2 rounded text-sm">
          {error}
        </div>
      )}
      
      {session ? (
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 ease-in-out`}
        >
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 ease-in-out`}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      )}
    </div>
  );
}
