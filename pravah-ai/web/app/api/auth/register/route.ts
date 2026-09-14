import { NextResponse } from 'next/server';
import { registerNewUser } from '@/lib/auth-service';
import { setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone, departmentId, designation } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const result = await registerNewUser({
      name,
      email,
      password,
      role: role || 'CITIZEN',
      phone,
      departmentId,
      designation,
      ipAddress: ip,
    });

    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    });

    setSessionCookie(response, result.token);

    return response;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed.' },
      { status: 400 }
    );
  }
}
