import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

async function handleRequest(request: NextRequest) {
  try {
    // Log request details
    console.log('📝 Request:', {
      method: request.method,
      url: request.url,
      path: request.nextUrl.pathname,
      params: request.nextUrl.searchParams
    });

    // Get the request body if it exists
    let body;
    if (request.body) {
      const clone = request.clone();
      const text = await clone.text();
      try {
        if (text) {
          body = JSON.parse(text);
          console.log('📝 Request body:', JSON.stringify(body, null, 2));
        }
      } catch (e) {
        console.log('📝 Request body parsing error:', e);
      }
    }

    // Create a new request with the correct URL
    const newUrl = request.url.replace('/api/auth/[...better-auth]', '/api/auth');
    console.log('🔄 Forwarding request to:', newUrl);

    // Create request options with type assertion for duplex
    const requestInit: RequestInit & { duplex: 'half' } = {
      method: request.method,
      headers: new Headers({
        'Content-Type': 'application/json',
        ...Object.fromEntries(request.headers.entries())
      }),
      duplex: 'half'
    };

    // Only add body if we parsed it successfully
    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    const authRequest = new Request(newUrl, requestInit);

    const response = await auth.handler(authRequest);
    
    // Log response for debugging
    const responseClone = response.clone();
    let responseBody;
    try {
      responseBody = await responseClone.json();
    } catch (e) {
      responseBody = await responseClone.text();
    }
    console.log('📤 Response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseBody
    });

    return response;
  } catch (error) {
    console.error('❌ Auth handler error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
