import React from 'react';
import prisma from '@/lib/prisma';
import { Bell, AlertTriangle, ShieldAlert, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { user: true },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-gold-400" />
            <span>LIVE INTELLIGENCE NOTIFICATION CENTER</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time advisory alerts regarding approaching SLA deadlines, circular routing deadlocks, and pending AI recommendations.
          </p>
        </div>

        <button className="text-xs text-gold-400 font-bold hover:underline">
          Mark All As Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          let badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
          let Icon = Bell;
          if (n.type === 'SLA_BREACH') {
            badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
            Icon = AlertTriangle;
          } else if (n.type === 'DEADLOCK') {
            badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            Icon = RotateCcw;
          } else if (n.type === 'RECOMMENDATION') {
            badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            Icon = Sparkles;
          }

          return (
            <div
              key={n.id}
              className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-4 shadow-card-dark transition-all flex items-start gap-4"
            >
              <div className={`p-2.5 rounded-lg border flex-shrink-0 ${badgeColor}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{n.title}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Addressed to: {n.user.name}</span>
                  <a
                    href="/dashboard/intelligence/recommendations"
                    className="text-gold-400 font-bold hover:underline uppercase text-[10px]"
                  >
                    Action Alert
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
