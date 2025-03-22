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

    // Only add body if it exists
    if (request.body) {
      const clone = request.clone();
      try {
        const body = await clone.json();
        console.log('📝 Request body:', JSON.stringify(body, null, 2));
        
        // Transform the body based on request type
        if (request.nextUrl.pathname === '/api/auth/sign-up/email') {
          requestInit.body = JSON.stringify({
            email: body.email,
            password: body.password,
            name: body.name,
            data: {
              name: body.name,
              callbackUrl: body.callbackUrl
            }
          });
        } else if (request.nextUrl.pathname === '/api/auth/sign-in/email') {
          requestInit.body = JSON.stringify({
            email: body.email,
            password: body.password
          });
        } else {
          requestInit.body = JSON.stringify(body);
        }
        console.log('📝 Transformed request body:', requestInit.body);
      } catch (e) {
        console.log('📝 Request body: No JSON body or empty');
      }
    }

    const authRequest = new Request(newUrl, requestInit);
    const response = await auth.handler(authRequest);
    
    // Log response for debugging
    const responseClone = response.clone();
    let responseBody;
    try {
      responseBody = await responseClone.json();
    } catch (e) {
      responseBody = '';
    }
    console.log('📤 Response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseBody
    });

    return response;
  } catch (error) {
    console.error('# SERVER_ERROR: ', error);
    return new Response('', { status: 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
