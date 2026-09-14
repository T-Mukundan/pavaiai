import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AIClient } from '@/lib/ai-client';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { toDepartmentId, reason } = body;
    const grievanceId = params.id;

    const grv = await prisma.grievance.findFirst({
      where: {
        OR: [{ id: grievanceId }, { grievanceNumber: grievanceId }],
      },
      include: {
        transfers: { include: { fromDepartment: true, toDepartment: true } },
      },
    });

    if (!grv) {
      return NextResponse.json({ error: 'Grievance not found' }, { status: 404 });
    }

    const fromDeptId = grv.departmentId;

    // Create Transfer Record
    const transfer = await prisma.transfer.create({
      data: {
        grievanceId: grv.id,
        fromDepartmentId: fromDeptId,
        toDepartmentId: toDepartmentId,
        reason: reason || 'Administrative jurisdiction reallocation',
      },
      include: { fromDepartment: true, toDepartment: true },
    });

    // Update grievance department & status
    await prisma.grievance.update({
      where: { id: grv.id },
      data: {
        departmentId: toDepartmentId,
        status: 'TRANSFERRED',
        updatedAt: new Date(),
      },
    });

    // Add status history
    await prisma.grievanceStatusHistory.create({
      data: {
        grievanceId: grv.id,
        status: 'TRANSFERRED',
        remarks: `Transferred from ${transfer.fromDepartment.name} to ${transfer.toDepartment.name}: ${reason}`,
        changedBy: 'Department Officer',
      },
    });

    // Check for deadlock loop using Tarjan SCC
    const allTransfers = [
      ...grv.transfers.map((t) => ({ from_department: t.fromDepartment.name, to_department: t.toDepartment.name })),
      { from_department: transfer.fromDepartment.name, to_department: transfer.toDepartment.name },
    ];

    const deadlockResult = await AIClient.detectDeadlock(allTransfers);

    if (deadlockResult.deadlock_detected) {
      await prisma.deadlockDetection.upsert({
        where: { grievanceId: grv.id },
        update: {
          detected: true,
          cyclePath: JSON.stringify(deadlockResult.cycle_paths[0] || []),
          severity: 'HIGH',
        },
        create: {
          grievanceId: grv.id,
          detected: true,
          cyclePath: JSON.stringify(deadlockResult.cycle_paths[0] || []),
          severity: 'HIGH',
        },
      });
    }

    // Add Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'TRANSFER',
        entityType: 'GRIEVANCE',
        entityId: grv.id,
        metadata: JSON.stringify({
          from: transfer.fromDepartment.name,
          to: transfer.toDepartment.name,
          deadlock: deadlockResult.deadlock_detected,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      transfer,
      deadlockDetected: deadlockResult.deadlock_detected,
    });
  } catch (error: any) {
    console.error('Error transferring grievance:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
