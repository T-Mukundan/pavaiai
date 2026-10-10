import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AIClient } from '@/lib/ai-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const departmentId = searchParams.get('departmentId');
    const search = searchParams.get('search');

    const city = searchParams.get('city');

    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (departmentId) where.departmentId = departmentId;
    if (city && city !== 'ALL' && city !== 'all') {
      where.location = {
        district: { contains: city },
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { grievanceNumber: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const grievances = await prisma.grievance.findMany({
      where,
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        department: true,
        location: true,
        riskPrediction: true,
        deadlockDetection: true,
      },
    });

    return NextResponse.json(grievances);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      department,
      ward,
      address,
      latitude,
      longitude,
      evidence,
      city,
      state,
      municipality,
    } = body;

    // 1. Resolve or find department
    let dept = await prisma.department.findFirst({
      where: {
        OR: [
          { name: { contains: department || '' } },
          { code: department },
        ],
      },
    });

    if (!dept) {
      dept = await prisma.department.findFirst() || ({} as any);
    }

    // 2. Resolve or create Location with dynamic city & state
    const resolvedCity = city || 'Bengaluru Urban';
    const resolvedState = state || 'Karnataka';
    const resolvedMuni = municipality || 'BBMP';

    const loc = await prisma.location.create({
      data: {
        address: address || `${ward || 'Central Zone'}, ${resolvedCity}`,
        latitude: typeof latitude === 'number' ? latitude : 12.9716,
        longitude: typeof longitude === 'number' ? longitude : 77.5946,
        state: resolvedState,
        district: resolvedCity,
        municipality: resolvedMuni,
        ward: ward || 'Central Zone',
      },
    });

    // 3. Generate sequential tracking ID
    const count = await prisma.grievance.count();
    const grvNumber = `GRV-2026-${String(count + 1).padStart(4, '0')}`;

    // 4. Calculate SLA Deadline (default 48 hours for civic infra)
    const targetHours = (dept && (dept.code === 'ROADS_HWY' || dept.code === 'ELECTRICITY')) ? 48 : 72;
    const slaDeadline = new Date(Date.now() + targetHours * 3600000);

    // 5. Call AI for initial risk score
    const riskResult = await AIClient.predictRisk({
      transfer_count: 0,
      inactivity_days: 0,
      officer_workload_ratio: 1.0,
      dept_backlog: 45,
      category_lag_days: 4,
      severity: 'MEDIUM',
      is_deadlocked: false,
    });

    // 6. Create Grievance Record
    const grievance = await prisma.grievance.create({
      data: {
        grievanceNumber: grvNumber,
        title,
        description,
        category: category || 'Civic Infrastructure',
        departmentId: dept?.id || 'default-dept',
        locationId: loc.id,
        priority: riskResult.risk_score >= 80 ? 'CRITICAL' : 'HIGH',
        status: 'SUBMITTED',
        severity: 'MEDIUM',
        slaDeadline,
      },
    });

    // 7. Initial Status History
    await prisma.grievanceStatusHistory.create({
      data: {
        grievanceId: grievance.id,
        status: 'SUBMITTED',
        remarks: 'Complaint registered via citizen portal with initial NLP classification.',
        changedBy: 'Citizen Self-Service',
      },
    });

    // 8. Risk Prediction
    await prisma.riskPrediction.create({
      data: {
        grievanceId: grievance.id,
        riskScore: riskResult.risk_score,
        riskLevel: riskResult.risk_level,
      },
    });

    // 9. Attach Evidence & Run AI Visual Analysis (Uploading to Supabase Storage if configured)
    if (evidence) {
      const { uploadEvidenceToSupabase } = await import('@/lib/supabase');
      const fileUrl = await uploadEvidenceToSupabase(evidence, `evidence_${grvNumber}.jpg`);

      const media = await prisma.media.create({
        data: {
          grievanceId: grievance.id,
          fileUrl: fileUrl,
          mediaType: 'image',
          latitude: loc.latitude,
          longitude: loc.longitude,
          uploadedBy: 'Citizen',
        },
      });

      const visionAssessment = await AIClient.analyzeVisual('evidence_photo.jpg', category);
      await prisma.mediaAnalysis.create({
        data: {
          mediaId: media.id,
          detectedObjects: JSON.stringify(visionAssessment.detected_objects),
          severity: visionAssessment.severity,
          description: visionAssessment.description,
          confidence: visionAssessment.confidence,
        },
      });
    }

    // 9b. Non-blocking MongoDB Real-time Sync
    try {
      const { backgroundSyncGrievance } = await import('@/lib/mongodb');
      backgroundSyncGrievance({
        grievanceNumber: grvNumber,
        title,
        description,
        category,
        department: dept?.name,
        city: resolvedCity,
        state: resolvedState,
        municipality: resolvedMuni,
        ward,
        slaDeadline,
        riskScore: riskResult.risk_score,
        createdAt: new Date(),
      });
    } catch {}

    // 10. Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_GRIEVANCE',
        entityType: 'GRIEVANCE',
        entityId: grievance.id,
        metadata: JSON.stringify({ trackingId: grvNumber, dept: dept?.name || 'Civic Infrastructure' }),
      },
    });

    return NextResponse.json({
      success: true,
      grievanceNumber: grvNumber,
      department: dept?.name || 'Civic Infrastructure',
      slaHours: targetHours,
      riskScore: riskResult.risk_score,
    });
  } catch (error: any) {
    console.error('Error creating grievance:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
