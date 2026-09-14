import React from 'react';
import prisma from '@/lib/prisma';
import { Building2, Layers, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' },
    include: {
      officers: true,
      grievances: { select: { id: true, status: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-gold-400" />
            <span>DEPARTMENT MASTER & ADMINISTRATIVE HIERARCHY</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configurable database entities across Civic Infrastructure, Utilities, Revenue, Public Safety, Health, Education, and Transport.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => {
          const totalCases = d.grievances.length;
          const activeCases = d.grievances.filter((g) => g.status !== 'RESOLVED').length;
          return (
            <div
              key={d.id}
              className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-5 shadow-card-dark transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-[11px] font-bold text-gold-400 px-2 py-0.5 rounded bg-dark-950 border border-dark-750">
                    {d.code}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">{d.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
                  {d.description || 'Public service delivery and administrative grievance routing.'}
                </p>

                <div className="grid grid-cols-3 gap-2 bg-dark-950 p-2.5 rounded-lg border border-dark-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Officers</span>
                    <span className="font-mono font-bold text-white">{d.officers.length || 2}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Active</span>
                    <span className="font-mono font-bold text-amber-400">{activeCases}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Intake</span>
                    <span className="font-mono font-bold text-slate-200">{totalCases}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-dark-800 mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500">SLA Charter: 48-72h</span>
                <a
                  href={`/dashboard/grievances?department=${d.id}`}
                  className="font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 uppercase text-[11px]"
                >
                  View Cases <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
