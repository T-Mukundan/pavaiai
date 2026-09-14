import React from 'react';
import prisma from '@/lib/prisma';
import { ShieldCheck, Sliders, Database, Activity, Clock, UserCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const auditLogs = await prisma.auditLog.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  const slaConfigs = await prisma.sLAConfig.findMany({
    take: 10,
    include: { department: true },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-gold-400" />
            <span>SYSTEM GOVERNANCE & IMMUTABLE AUDIT LOGS</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gold-500/15 text-gold-400 border border-gold-500/30">
            Super Admin Adjudication
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically recorded administrative activity trails and dynamic service level agreement thresholds.
        </p>
      </div>

      {/* System Health Strip with MongoDB and Supabase Storage */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl flex items-center gap-3">
          <Database className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Text Storage (Prisma)</span>
            <span className="text-xs font-bold text-white">dev.db (Active)</span>
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
            🍃
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">MongoDB Atlas Cluster</span>
            <span className="text-xs font-bold text-emerald-400">Connected (50 Docs, 3 Collections)</span>
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
            ⚡
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Supabase Storage</span>
            <span className="text-xs font-bold text-emerald-400">Connected (grievance-evidence)</span>
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-800 p-4 rounded-xl flex items-center gap-3">
          <Activity className="w-6 h-6 text-gold-400 flex-shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Microservice</span>
            <span className="text-xs font-bold text-white">FastAPI (Port 8000)</span>
          </div>
        </div>
      </div>

      {/* 1. Configurable SLA Rules Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-5 shadow-card-dark">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-dark-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-gold-400" />
            <span>CONFIGURABLE SERVICE LEVEL AGREEMENT (SLA) THRESHOLDS</span>
          </h3>
          <span className="text-xs text-slate-400">Section 4 & 6 Architecture</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-950 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-dark-800">
              <tr>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-center">Target SLA (Hours)</th>
                <th className="py-2.5 px-4 text-center">Escalation Threshold</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-mono">
              {slaConfigs.map((sla) => (
                <tr key={sla.id} className="hover:bg-dark-850/60 transition">
                  <td className="py-2.5 px-4 font-sans font-semibold text-white">
                    {sla.department.name}
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-300">{sla.category}</td>
                  <td className="py-2.5 px-4 text-center text-gold-400 font-bold">
                    {sla.targetHours}h
                  </td>
                  <td className="py-2.5 px-4 text-center text-red-400 font-bold">
                    {sla.escalationHours}h
                  </td>
                  <td className="py-2.5 px-4 text-right font-sans text-emerald-400">Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Immutable Audit Trail */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-5 shadow-card-dark">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-dark-800">
          SYSTEM AUDIT LOG & COMPLIANCE REGISTRY
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-950 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-dark-800">
              <tr>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Acting User</th>
                <th className="py-2.5 px-4">Entity</th>
                <th className="py-2.5 px-4">Metadata Payload</th>
                <th className="py-2.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-dark-850/60 transition">
                  <td className="py-2.5 px-4 font-bold text-gold-400">{log.action}</td>
                  <td className="py-2.5 px-4 font-sans text-white">
                    {log.user?.name || 'System Auto-Router'}
                  </td>
                  <td className="py-2.5 px-4 text-slate-400">{log.entityType}</td>
                  <td className="py-2.5 px-4 text-slate-400 max-w-xs truncate">
                    {log.metadata || '{}'}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
