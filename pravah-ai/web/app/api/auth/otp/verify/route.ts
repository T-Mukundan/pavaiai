import { NextResponse } from 'next/server';
import { verifyCitizenOtp } from '@/lib/auth-service';
import { setSessionCookie } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Mobile number and verification code are required.' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const result = await verifyCitizenOtp(phone, otp, ip);

    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    });

    setSessionCookie(response, result.token);

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
