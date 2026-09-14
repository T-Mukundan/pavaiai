import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let grievanceId = '';
    let returnUrl = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      grievanceId = body.grievanceId;
      returnUrl = body.returnUrl;
    } else {
      const formData = await request.formData();
      grievanceId = (formData.get('grievanceId') as string) || '';
      returnUrl = (formData.get('returnUrl') as string) || '';
    }

    if (!grievanceId) {
      if (contentType.includes('application/json')) {
        return NextResponse.json({ error: 'grievanceId is required' }, { status: 400 });
      }
      return NextResponse.redirect(new URL('/dashboard/intelligence/recommendations', request.url), 303);
    }

    // 1. Resolve grievance by ID or grievanceNumber
    const grv = await prisma.grievance.findFirst({
      where: {
        OR: [{ id: grievanceId }, { grievanceNumber: grievanceId }],
      },
    });

    if (!grv) {
      if (contentType.includes('application/json')) {
        return NextResponse.json({ error: 'Grievance not found' }, { status: 404 });
      }
      return NextResponse.redirect(new URL('/dashboard/intelligence/recommendations', request.url), 303);
    }

    // 2. Find and update Recommendation
    const rec = await prisma.recommendation.findFirst({
      where: { grievanceId: grv.id },
      orderBy: { createdAt: 'desc' },
    });

    if (rec) {
      await prisma.recommendation.update({
        where: { id: rec.id },
        data: {
          status: 'APPROVED',
          actionTakenBy: 'Dr. Sunita Rao, IAS (Nodal Officer)',
        },
      });
    }

    // 3. Update Grievance Status to IN_PROGRESS & priority to CRITICAL
    await prisma.grievance.update({
      where: { id: grv.id },
      data: {
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        updatedAt: new Date(),
      },
    });

    // 4. Record Grievance Status History
    await prisma.grievanceStatusHistory.create({
      data: {
        grievanceId: grv.id,
        status: 'IN_PROGRESS',
        remarks: 'Nodal Officer approved AI recommendation: Escalated for expedited inter-agency joint execution.',
        changedBy: 'Dr. Sunita Rao, IAS (Nodal Officer)',
      },
    });

    // 5. Add Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'APPROVE_RECOMMENDATION',
        entityType: 'RECOMMENDATION',
        entityId: rec?.id || grv.id,
        metadata: JSON.stringify({
          grievanceNumber: grv.grievanceNumber,
          recommendationId: rec?.id,
          action: 'APPROVED',
          approver: 'Dr. Sunita Rao, IAS (Nodal Officer)',
        }),
      },
    });

    // 6. JSON API response
    if (contentType.includes('application/json')) {
      return NextResponse.json({
        success: true,
        grievanceNumber: grv.grievanceNumber,
        status: 'APPROVED',
        message: 'Recommendation approved and grievance escalated successfully.',
      });
    }

    // 7. HTTP 303 See Other Redirect (Safe GET redirect after POST)
    const target = returnUrl || `/grievances/${grv.grievanceNumber}`;
    return NextResponse.redirect(new URL(target, request.url), 303);
  } catch (error: any) {
    console.error('Error approving recommendation:', error);
    if (request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
    return NextResponse.redirect(new URL('/dashboard/intelligence/recommendations', request.url), 303);
  }
}
