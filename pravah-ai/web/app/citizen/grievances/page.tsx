import React from 'react';
import prisma from '@/lib/prisma';
import CitizenGrievancesExplorer from '@/components/citizen/CitizenGrievancesExplorer';

export const dynamic = 'force-dynamic';

export default async function CitizenGrievancesPage() {
  const grievances = await prisma.grievance.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: {
      department: true,
      location: true,
      riskPrediction: true,
      deadlockDetection: true,
    },
  });

  return <CitizenGrievancesExplorer initialGrievances={grievances as any} />;
}
