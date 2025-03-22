import { authClient } from '@/lib/auth-client';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get session from client
    const { data: sessionData } = await authClient.getSession();

    if (!sessionData?.session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, sessionData.session.userId)
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in /api/auth/user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
