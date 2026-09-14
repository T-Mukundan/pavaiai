import React from 'react';
import GrievanceMap from '@/components/map/GrievanceMap';
import prisma from '@/lib/prisma';
import { MapPin, Filter, Layers, Flame, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MapPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  // Fetch grievances with location data
  let rawGrievances: any[] = [];
  try {
    rawGrievances = await prisma.grievance.findMany({
      take: 60,
      include: {
        department: true,
        location: true,
        riskPrediction: true,
        deadlockDetection: true,
        media: { take: 1 },
      },
    });
  } catch (err) {
    console.error('Error loading grievances for map:', err);
  }

  // Filter out any without coordinates and format
  const mapGrievances = rawGrievances
    .filter((g) => g.location?.latitude && g.location?.longitude)
    .map((g) => ({
      id: g.id,
      grievanceNumber: g.grievanceNumber,
      title: g.title,
      category: g.category,
      departmentName: g.department?.name || 'General',
      latitude: g.location.latitude,
      longitude: g.location.longitude,
      address: g.location.address,
      ward: g.location.ward,
      riskScore: g.riskPrediction?.riskScore || 50,
      status: g.status,
      severity: g.severity,
      isDeadlocked: g.deadlockDetection?.detected || false,
      isRecurring: g.category.includes('Road') || g.category.includes('Water'),
      createdAt: g.createdAt.toISOString(),
      imageUrl: g.media[0]?.fileUrl,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
              GEOGRAPHIC GIS INTELLIGENCE MAP
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30">
              Esri Dark Canvas GIS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial plotting of citizen grievances, high-risk breach vectors, and procedural deadlock nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/dashboard/map/hotspots"
            className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>DBSCAN Hotspots</span>
          </a>
        </div>
      </div>

      {/* Map Interactive Component */}
      <GrievanceMap grievances={mapGrievances} />

      {/* Geospatial Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Plotted Pins</span>
          <div className="text-xl font-display font-black text-white mt-1">{mapGrievances.length} Active Nodes</div>
          <span className="text-[11px] text-slate-500">Across 12 urban wards</span>
        </div>
        <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl">
          <span className="text-[10px] font-bold uppercase text-red-400">High Risk Clusters</span>
          <div className="text-xl font-display font-black text-red-400 mt-1">
            {mapGrievances.filter((g) => g.riskScore >= 75).length} Critical
          </div>
          <span className="text-[11px] text-slate-500">Predicted SLA breaches</span>
        </div>
        <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl">
          <span className="text-[10px] font-bold uppercase text-purple-400">Deadlocked Hotspots</span>
          <div className="text-xl font-display font-black text-purple-400 mt-1">
            {mapGrievances.filter((g) => g.isDeadlocked).length} Cases
          </div>
          <span className="text-[11px] text-slate-500">Tarjan SCC detected</span>
        </div>
        <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl">
          <span className="text-[10px] font-bold uppercase text-gold-400">Primary Concentrated Ward</span>
          <div className="text-xl font-display font-black text-gold-400 mt-1">Ward 112</div>
          <span className="text-[11px] text-slate-500">Central Bus Terminal & MG Road</span>
        </div>
      </div>
    </div>
  );
}
