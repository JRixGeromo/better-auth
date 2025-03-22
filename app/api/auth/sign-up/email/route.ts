import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    console.log('Sign-up request:', body);

    const { email, password, name } = body;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });

    if (existingUser) {
      return NextResponse.json(
        { error: { message: 'Email already exists' } },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const now = new Date();

    // Create user
    const [user] = await db.insert(schema.users)
      .values({
        id: userId,
        email,
        name,
        password: hashedPassword,
        emailVerified: false,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    console.log('Created user:', user);

    // Create session
    const sessionId = uuidv4();
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const [session] = await db.insert(schema.sessions)
      .values({
        id: sessionId,
        token: sessionToken,
        userId: userId,
        expiresAt,
        createdAt: now,
        updatedAt: now,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        userAgent: request.headers.get('user-agent') || ''
      })
      .returning();

    console.log('Created session:', session);

    // Set cookie
    const response = NextResponse.json({ user });
    response.headers.set('Set-Cookie', `session=${session.token}; HttpOnly; Path=/; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''} Max-Age=${30 * 24 * 60 * 60}`);

    return response;
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
