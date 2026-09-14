import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const grievanceId = formData.get('grievanceId') as string;

    if (grievanceId) {
      // Find recommendation
      const rec = await prisma.recommendation.findFirst({
        where: { grievanceId },
      });

      if (rec) {
        await prisma.recommendation.update({
          where: { id: rec.id },
          data: { status: 'APPROVED', actionTakenBy: 'Dr. Sunita Rao, IAS (Nodal Officer)' },
        });
      }

      // Update Grievance Status to ESCALATED or IN_PROGRESS
      const grv = await prisma.grievance.update({
        where: { id: grievanceId },
        data: { status: 'IN_PROGRESS', priority: 'CRITICAL' },
      });

      // Add status history
      await prisma.grievanceStatusHistory.create({
        data: {
          grievanceId,
          status: 'IN_PROGRESS',
          remarks: 'Nodal Officer approved AI recommendation: Escalated for expedited inter-agency joint execution.',
          changedBy: 'Dr. Sunita Rao, IAS (Nodal Officer)',
        },
      });

      // Add Audit Log
      await prisma.auditLog.create({
        data: {
          action: 'APPROVE_RECOMMENDATION',
          entityType: 'RECOMMENDATION',
          entityId: rec?.id || grievanceId,
          metadata: JSON.stringify({ grievanceNumber: grv.grievanceNumber, action: 'APPROVED' }),
        },
      });

      return NextResponse.redirect(new URL(`/grievances/${grv.grievanceNumber}`, request.url));
    }

    return NextResponse.redirect(new URL('/dashboard/intelligence/recommendations', request.url));
  } catch (error: any) {
    console.error('Error approving recommendation:', error);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
