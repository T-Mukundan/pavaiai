import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const grievanceId = formData.get('grievanceId') as string;

    if (grievanceId) {
      const rec = await prisma.recommendation.findFirst({
        where: { grievanceId },
      });

      if (rec) {
        await prisma.recommendation.update({
          where: { id: rec.id },
          data: { status: 'REJECTED', actionTakenBy: 'Nodal Officer' },
        });
      }

      const grv = await prisma.grievance.findUnique({ where: { id: grievanceId } });

      await prisma.auditLog.create({
        data: {
          action: 'REJECT_RECOMMENDATION',
          entityType: 'RECOMMENDATION',
          entityId: rec?.id || grievanceId,
          metadata: JSON.stringify({ grievanceNumber: grv?.grievanceNumber, action: 'REJECTED' }),
        },
      });

      if (grv) {
        return NextResponse.redirect(new URL(`/grievances/${grv.grievanceNumber}`, request.url));
      }
    }

    return NextResponse.redirect(new URL('/dashboard/intelligence/recommendations', request.url));
  } catch (error: any) {
    console.error('Error rejecting recommendation:', error);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
