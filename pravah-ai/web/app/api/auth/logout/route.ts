import { NextResponse } from 'next/server';
import { clearSessionCookie, getCurrentUser } from '@/lib/session';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (user) {
      try {
        await prisma.auditLog.create({
          data: {
            action: 'USER_LOGOUT',
            entityType: 'User',
            entityId: user.id,
            userId: user.id,
            metadata: JSON.stringify({ email: user.email, timestamp: new Date().toISOString() }),
          },
        });
      } catch {}
    }

    const response = NextResponse.json({ success: true, message: 'Signed out successfully.' });
    clearSessionCookie(response);
    return response;
  } catch (err: any) {
    const response = NextResponse.json({ success: true });
    clearSessionCookie(response);
    return response;
  }
}
