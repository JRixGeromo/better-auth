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
    console.log('Sign-in request:', body);

    const { email, password } = body;

    // Find user
    const user = await db.query.user.findFirst({
      where: eq(schema.user.email, email)
    });

    if (!user) {
      return NextResponse.json(
        { error: { message: 'Invalid credentials' } },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: { message: 'Invalid credentials' } },
        { status: 401 }
      );
    }

    // Create session
    const sessionId = uuidv4();
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const now = new Date();

    const [session] = await db.insert(schema.session)
      .values({
        id: sessionId,
        userId: user.id,
        token: sessionToken,
        expiresAt,
        createdAt: now,
        updatedAt: now,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        userAgent: request.headers.get('user-agent') || ''
      })
      .returning();

    return NextResponse.json({ user, session });
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: { message: 'An error occurred during sign-in' } },
      { status: 500 }
    );
  }
}
