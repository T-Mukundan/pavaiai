import React from 'react';
import prisma from '@/lib/prisma';
import CitizenGrievancesExplorer from '@/components/citizen/CitizenGrievancesExplorer';
import { getFallbackGrievances } from '@/lib/fallback-data';

export const dynamic = 'force-dynamic';

export default async function CitizenGrievancesPage() {
  let grievances: any[] = [];

  try {
    grievances = await prisma.grievance.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        department: true,
        location: true,
        riskPrediction: true,
        deadlockDetection: true,
      },
    });
  } catch (err) {
    console.warn('Prisma query failed on serverless, using resilient fallback:', err);
  }

  if (!grievances || grievances.length === 0) {
    grievances = getFallbackGrievances();
  }

  return <CitizenGrievancesExplorer initialGrievances={grievances as any} />;
}
