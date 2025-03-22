import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Get session token from cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  
  if (!sessionToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Find session
  const session = await db.query.sessions.findFirst({
    where: eq(schema.sessions.token, sessionToken)
  });

  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  // Find user
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, session.userId)
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
