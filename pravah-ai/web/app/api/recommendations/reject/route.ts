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

    const rec = await prisma.recommendation.findFirst({
      where: { grievanceId: grv.id },
      orderBy: { createdAt: 'desc' },
    });

    if (rec) {
      await prisma.recommendation.update({
        where: { id: rec.id },
        data: {
          status: 'REJECTED',
          actionTakenBy: 'Dr. Sunita Rao, IAS (Nodal Officer)',
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'REJECT_RECOMMENDATION',
        entityType: 'RECOMMENDATION',
        entityId: rec?.id || grv.id,
        metadata: JSON.stringify({
          grievanceNumber: grv.grievanceNumber,
          recommendationId: rec?.id,
          action: 'REJECTED',
        }),
      },
    });

    if (contentType.includes('application/json')) {
      return NextResponse.json({
        success: true,
        grievanceNumber: grv.grievanceNumber,
        status: 'REJECTED',
      });
    }

    const target = returnUrl || `/grievances/${grv.grievanceNumber}`;
    return NextResponse.redirect(new URL(target, request.url), 303);
  } catch (error: any) {
    console.error('Error rejecting recommendation:', error);
    if (request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
    return NextResponse.redirect(new URL('/dashboard/intelligence/recommendations', request.url), 303);
  }
}
