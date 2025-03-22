import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

// Create a handler that uses the auth instance
const handler = {
  GET: async (request: NextRequest) => auth.handler(request),
  POST: async (request: NextRequest) => auth.handler(request),
  PUT: async (request: NextRequest) => auth.handler(request),
  DELETE: async (request: NextRequest) => auth.handler(request)
};

export const { GET, POST, PUT, DELETE } = handler;
