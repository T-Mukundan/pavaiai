import React from 'react';
import prisma from '@/lib/prisma';
import { AlertTriangle, MapPin, ArrowUpRight, ShieldAlert, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HighRiskPage() {
  const grievances = await prisma.grievance.findMany({
    where: {
      riskPrediction: {
        riskScore: { gte: 75 },
      },
    },
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: {
      department: true,
      location: true,
      riskPrediction: true,
      deadlockDetection: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span>HIGH SLA RISK PREDICTION QUEUE</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            TreeSHAP Calculated &gt;75%
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Complaints identified with extreme probability of breaching administrative service level agreements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grievances.map((g) => {
          const riskScore = g.riskPrediction?.riskScore || 80;
          return (
            <div
              key={g.id}
              className="bg-dark-900 border border-dark-800 hover:border-red-500/40 rounded-xl p-5 shadow-card-dark transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-white">{g.grievanceNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-xs font-bold shadow-red-glow">
                    {riskScore}% RISK
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                  {g.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {g.description}
                </p>

                <div className="space-y-1 text-xs text-slate-300 bg-dark-950 p-2.5 rounded border border-dark-800 mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-gold-400">{g.department.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ward:</span>
                    <span className="text-slate-300">{g.location?.ward || 'Central'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SLA Deadline:</span>
                    <span className="text-rose-400 font-mono font-bold">
                      {new Date(g.slaDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-dark-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  Priority: <strong className="text-red-400 uppercase">{g.priority}</strong>
                </span>
                <a
                  href={`/grievances/${g.grievanceNumber}`}
                  className="flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 uppercase"
                >
                  Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
