import React from 'react';
import prisma from '@/lib/prisma';
import { ShieldAlert, Clock, ArrowUpRight, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SLABreachesPage() {
  const grievances = await prisma.grievance.findMany({
    where: {
      status: { not: 'RESOLVED' },
      slaDeadline: { lt: new Date() },
    },
    take: 30,
    orderBy: { slaDeadline: 'asc' },
    include: {
      department: true,
      location: true,
      riskPrediction: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <span>SLA BREACHES & OVERDUE GRIEVANCES</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
            {grievances.length} Breached Cases
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Complaints that have exceeded the statutory citizen service charter deadline and require immediate escalation.
        </p>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden shadow-card-dark">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-dark-950 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-dark-800">
            <tr>
              <th className="py-3.5 px-4">Grievance ID</th>
              <th className="py-3.5 px-4">Title</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Ward / Area</th>
              <th className="py-3.5 px-4 text-center">Overdue Days</th>
              <th className="py-3.5 px-4 text-right">Escalate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {grievances.map((g) => {
              const overdueDays = Math.max(1, Math.round((Date.now() - new Date(g.slaDeadline).getTime()) / 86400000));
              return (
                <tr key={g.id} className="hover:bg-dark-850/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    <a href={`/grievances/${g.grievanceNumber}`} className="hover:text-gold-400">
                      {g.grievanceNumber}
                    </a>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-semibold text-white truncate">{g.title}</div>
                    <div className="text-[11px] text-slate-400">{g.category}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">{g.department.name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{g.location?.ward || 'Central'}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono font-bold">
                      +{overdueDays} Days
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`/grievances/${g.grievanceNumber}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-400 hover:text-gold-300 border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 rounded transition"
                    >
                      Examine <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
