import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth-service';
import { setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const authResult = await authenticateUser(email, password, ip);

    if (!authResult) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: authResult.user,
      token: authResult.token,
    });

    // Set secure HTTP-only cookie
    setSessionCookie(response, authResult.token);

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: err.message || 'Authentication service error.' },
      { status: 500 }
    );
  }
}
