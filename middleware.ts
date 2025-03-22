import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authClient } from '@/lib/auth-client';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get session from cookie
  const sessionToken = request.cookies.get('session')?.value;
  
  if (sessionToken) {
    // Validate session
    const { data } = await authClient.validateSession(sessionToken);
    
    if (data?.session) {
      // Session is valid, attach session to request
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-session-token', sessionToken);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
