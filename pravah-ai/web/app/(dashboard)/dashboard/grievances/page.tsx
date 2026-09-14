import React from 'react';
import prisma from '@/lib/prisma';
import { 
  FileSpreadsheet, 
  MapPin, 
  ArrowUpRight, 
  RotateCcw, 
  Filter, 
  Search, 
  AlertTriangle 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AllGrievancesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const statusFilter = searchParams?.status;
  const deptFilter = searchParams?.department;
  const searchQuery = searchParams?.search;

  const whereClause: any = {};
  if (statusFilter) whereClause.status = statusFilter;
  if (deptFilter) whereClause.departmentId = deptFilter;
  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery } },
      { grievanceNumber: { contains: searchQuery } },
      { description: { contains: searchQuery } },
    ];
  }

  const grievances = await prisma.grievance.findMany({
    where: whereClause,
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      department: true,
      location: true,
      riskPrediction: true,
      deadlockDetection: true,
    },
  });

  const departments = await prisma.department.findMany({
    take: 20,
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-gold-400" />
            <span>ALL GRIEVANCE INTAKE REPOSITORY</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete database ledger of public grievances across civic, utility, and administrative departments.
          </p>
        </div>

        <a
          href="/citizen/grievances/new"
          className="bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-gold-glow transition flex items-center gap-1.5"
        >
          <span>File New Grievance</span>
        </a>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/dashboard/grievances"
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              !statusFilter ? 'bg-gold-500 text-black shadow-gold-glow' : 'bg-dark-800 text-slate-300 hover:text-white'
            }`}
          >
            All Intake
          </a>
          <a
            href="/dashboard/grievances?status=IN_PROGRESS"
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'IN_PROGRESS' ? 'bg-gold-500 text-black shadow-gold-glow' : 'bg-dark-800 text-slate-300 hover:text-white'
            }`}
          >
            In Progress
          </a>
          <a
            href="/dashboard/grievances?status=TRANSFERRED"
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'TRANSFERRED' ? 'bg-gold-500 text-black shadow-gold-glow' : 'bg-dark-800 text-slate-300 hover:text-white'
            }`}
          >
            Transferred
          </a>
          <a
            href="/dashboard/grievances?status=RESOLVED"
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'RESOLVED' ? 'bg-gold-500 text-black shadow-gold-glow' : 'bg-dark-800 text-slate-300 hover:text-white'
            }`}
          >
            Resolved
          </a>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Showing <strong>{grievances.length}</strong> records
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden shadow-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-950 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-dark-800">
              <tr>
                <th className="py-3.5 px-4">Grievance ID</th>
                <th className="py-3.5 px-4">Title & Description</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Location / Ward</th>
                <th className="py-3.5 px-4 text-center">SLA Risk</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {grievances.map((g) => {
                const riskScore = g.riskPrediction?.riskScore || 50;
                const isDeadlocked = g.deadlockDetection?.detected;
                return (
                  <tr key={g.id} className="hover:bg-dark-850/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      <a href={`/grievances/${g.grievanceNumber}`} className="hover:text-gold-400">
                        {g.grievanceNumber}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-white truncate">{g.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{g.category}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-200">
                      {g.department.name}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                      <div className="flex items-center gap-1 truncate max-w-[160px]">
                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span>{g.location?.ward || 'Central Urban'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                          riskScore >= 80
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-red-glow'
                            : riskScore >= 65
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}
                      >
                        {riskScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {isDeadlocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold uppercase">
                          <RotateCcw className="w-3 h-3" /> Deadlock
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-dark-700 text-[10px] uppercase">
                          {g.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <a
                        href={`/grievances/${g.grievanceNumber}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-400 hover:text-gold-300 border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 rounded transition"
                      >
                        Details <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
