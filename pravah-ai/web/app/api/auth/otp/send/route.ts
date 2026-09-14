import { NextResponse } from 'next/server';
import { sendCitizenOtp } from '@/lib/auth-service';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Mobile number is required.' }, { status: 400 });
    }

    const result = sendCitizenOtp(phone);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
