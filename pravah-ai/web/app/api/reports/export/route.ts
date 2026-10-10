import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'grievances';

    if (type === 'analytics') {
      const headers = ['Department', 'Active Backlog', 'Breached Cases', 'Resolved Cases', 'Standard SLA Hours'];
      const rows = [
        ['Roads & Highways', '84', '16', '140', '48'],
        ['Drainage & Stormwater', '62', '11', '95', '48'],
        ['Water Supply & Sewerage', '58', '8', '112', '72'],
        ['Electricity Distribution', '45', '4', '130', '24'],
        ['Solid Waste Management', '40', '2', '165', '48'],
        ['Revenue & Land Administration', '36', '9', '48', '72'],
        ['Traffic & Transportation', '22', '1', '82', '48'],
      ];

      const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="pravah_analytics_export.csv"',
        },
      });
    }

    // Default: Export Grievances Census
    const grievances = await prisma.grievance.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        department: true,
        location: true,
        riskPrediction: true,
      },
    });

    const headers = [
      'Grievance ID',
      'Title',
      'Category',
      'Department',
      'Ward',
      'Address',
      'Status',
      'Priority',
      'SLA Risk (%)',
      'SLA Deadline',
      'Created At',
    ];

    const rows = grievances.map((g) => [
      g.grievanceNumber,
      (g.title || '').replace(/"/g, '""'),
      g.category || '',
      g.department?.name || '',
      g.location?.ward || '',
      (g.location?.address || '').replace(/"/g, '""'),
      g.status,
      g.priority,
      g.riskPrediction?.riskScore?.toString() || '50',
      g.slaDeadline ? new Date(g.slaDeadline).toISOString() : '',
      g.createdAt ? new Date(g.createdAt).toISOString() : '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="pravah_grievance_ledger.csv"',
      },
    });
  } catch (error: any) {
    console.error('CSV Export Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
