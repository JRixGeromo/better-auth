import { auth } from '@/lib/auth';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/auth/user called');
    
    // Get session token from cookie
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log('All cookies:', allCookies);
    
    const sessionCookie = cookieStore.get('session');
    console.log('Session cookie:', sessionCookie);

    if (!sessionCookie) {
      console.log('No session cookie found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find session
    const session = await db.query.sessions.findFirst({
      where: eq(schema.sessions.token, sessionCookie.value)
    });
    console.log('Found session:', session);

    if (!session) {
      console.log('No session found');
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, session.userId)
    });
    console.log('Found user:', user);

    if (!user) {
      console.log('No user found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in /api/auth/user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
