import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

async function handleRequest(request: NextRequest) {
  try {
    // Clone the request to read the body
    const clone = request.clone();
    const contentType = request.headers.get('content-type');
    
    // Log request details
    console.log('Auth request:', {
      method: request.method,
      url: request.url,
      contentType
    });

    // If it's a POST request with JSON content, parse and log the body
    if (request.method === 'POST' && contentType?.includes('application/json')) {
      const body = await clone.json();
      console.log('Request body:', body);
    }

    // Handle the request with Better Auth
    const response = await auth.handler(request);
    
    // Log response status
    console.log('Auth response status:', response.status);
    
    return response;
  } catch (error) {
    console.error('Auth handler error:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}
