'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  Flame,
  AlertTriangle,
  RotateCcw,
  Camera,
  BrainCircuit,
  Network,
  GitPullRequest,
  SearchCode,
  CheckCheck,
  Building2,
  Users,
  BarChart3,
  FileSpreadsheet,
  Bell,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export default function Sidebar() {
  const pathname = usePathname();

  const menuGroups: SidebarGroup[] = [
    {
      title: 'COMMAND OVERVIEW',
      items: [
        { label: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Interactive Map GIS', href: '/dashboard/map', icon: MapPin },
        { label: 'Geographic Hotspots', href: '/dashboard/map/hotspots', icon: Flame, badge: 'DBSCAN', badgeColor: 'bg-amber-500/20 text-amber-300' },
      ],
    },
    {
      title: 'GRIEVANCE VECTORS',
      items: [
        { label: 'All Grievances', href: '/dashboard/grievances', icon: FileSpreadsheet },
        { label: 'High SLA Risk Queue', href: '/dashboard/grievances/high-risk', icon: AlertTriangle, badge: '86', badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30' },
        { label: 'Circular Deadlocks', href: '/dashboard/grievances/deadlocked', icon: RotateCcw, badge: '17', badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
        { label: 'Recurring Clusters', href: '/dashboard/grievances/recurring', icon: Network, badge: '31', badgeColor: 'bg-gold-500/20 text-gold-300' },
        { label: 'Visual Evidence Vault', href: '/dashboard/evidence', icon: Camera },
      ],
    },
    {
      title: 'AI INTELLIGENCE SUITE',
      items: [
        { label: 'SLA Risk Prediction', href: '/dashboard/intelligence/risk', icon: BrainCircuit },
        { label: 'Semantic Clusters', href: '/dashboard/intelligence/clusters', icon: SearchCode, badge: 'MiniLM', badgeColor: 'bg-blue-500/20 text-blue-300' },
        { label: 'Tarjan SCC Deadlocks', href: '/dashboard/intelligence/deadlocks', icon: GitPullRequest, badge: 'Graph', badgeColor: 'bg-purple-500/20 text-purple-300' },
        { label: 'Root Cause Analytics', href: '/dashboard/intelligence/root-causes', icon: SearchCode },
        { label: 'AI Recommendations', href: '/dashboard/intelligence/recommendations', icon: CheckCheck, badge: 'Actions', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      ],
    },
    {
      title: 'ORGANIZATION & RESOURCES',
      items: [
        { label: 'Department Master', href: '/dashboard/departments', icon: Building2, badge: '25' },
        { label: 'Officer Workload', href: '/dashboard/officers', icon: Users, badge: 'Imbalance' },
        { label: 'Deep Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { label: 'Intelligence Reports', href: '/dashboard/reports', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'GOVERNANCE & AUDIT',
      items: [
        { label: 'Live Notifications', href: '/dashboard/notifications', icon: Bell },
        { label: 'System Admin & Logs', href: '/dashboard/admin', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-dark-900 border-r border-dark-800 flex-shrink-0 hidden lg:block overflow-y-auto h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-6">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3">
              {group.title}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname === item.href);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gold-500/15 text-gold-300 border border-gold-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-gold-400' : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          item.badgeColor || 'bg-dark-800 text-slate-400 border border-dark-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom Support Badge */}
        <div className="pt-4 border-t border-dark-800 text-[11px] text-slate-400 px-3 space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>PRAVAH-AI Core v1.0</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <p className="text-[10px] text-slate-400">
            Advisory decision intelligence for Indian public administration.
          </p>
        </div>
      </div>
    </aside>
  );
}
