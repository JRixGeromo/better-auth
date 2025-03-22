"use client";

import { useAuth } from "better-auth/react";
import AuthButtons from "@/components/AuthButtons";

export default function Dashboard() {
  const { session } = useAuth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4 text-gray-600">Access Denied. Please log in.</p>
        <AuthButtons />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Welcome{session.user?.email ? `, ${session.user.email}` : ''}!</h1>
      <AuthButtons />
    </div>
  );
}
