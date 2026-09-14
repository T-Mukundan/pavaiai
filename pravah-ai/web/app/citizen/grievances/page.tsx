import React from 'react';
import prisma from '@/lib/prisma';
import { PlusCircle, Clock, MapPin, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CitizenGrievancesPage() {
  const grievances = await prisma.grievance.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      department: true,
      location: true,
      riskPrediction: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
            MY REGISTERED GRIEVANCES
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Citizen portal tracking active complaints, SLA resolution progress, and department allocations.
          </p>
        </div>

        <a
          href="/citizen/grievances/new"
          className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg text-xs font-bold tracking-wide shadow-gold-glow transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>File New Grievance</span>
        </a>
      </div>

      <div className="space-y-3">
        {grievances.map((g) => {
          const riskScore = g.riskPrediction?.riskScore || 50;
          return (
            <div
              key={g.id}
              className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-4 sm:p-5 shadow-card-dark transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black text-gold-400">
                    {g.grievanceNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-dark-800 text-slate-300 font-mono text-[10px] uppercase font-bold border border-dark-700">
                    {g.status}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Filed on {new Date(g.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white hover:text-gold-400 transition-colors">
                  <a href={`/grievances/${g.grievanceNumber}`}>{g.title}</a>
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="text-gold-400 font-medium">{g.department.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {g.location?.ward || 'Central Zone'}
                  </span>
                  <span>•</span>
                  <span className="text-slate-500 font-mono">
                    SLA Target: {new Date(g.slaDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <a
                  href={`/grievances/${g.grievanceNumber}`}
                  className="bg-dark-800 hover:bg-dark-750 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-dark-700 hover:border-gold-500/50 transition flex items-center gap-1"
                >
                  <span>View Timeline</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
