'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Search, 
  MapPin, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  Filter, 
  Eye, 
  FileText,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CITIES_DATA } from '@/lib/cities';
import { formatDate } from '@/lib/format';

interface LocationInfo {
  id: string;
  address: string;
  ward?: string | null;
  district?: string | null;
  state?: string | null;
  municipality?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
}

interface GrievanceItem {
  id: string;
  grievanceNumber: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  severity: string;
  slaDeadline: string | Date;
  createdAt: string | Date;
  department: DepartmentInfo;
  location?: LocationInfo | null;
  riskPrediction?: { riskScore: number; riskLevel?: string } | null;
  deadlockDetection?: { detected: boolean } | null;
}

interface Props {
  initialGrievances: GrievanceItem[];
}

export default function CitizenGrievancesExplorer({ initialGrievances }: Props) {
  const router = useRouter();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Direct Track Handler
  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackingIdInput.trim();
    if (cleanId) {
      router.push(`/grievances/${encodeURIComponent(cleanId)}`);
    }
  };

  const [localGrievances, setLocalGrievances] = useState<GrievanceItem[]>([]);

  // Load any grievances filed in this browser session
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('pravah_local_grievances');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLocalGrievances(parsed);
        }
      }
    } catch {}
  }, []);

  // Merge server grievances with locally stored grievances
  const allGrievances = useMemo(() => {
    const existing = new Set(initialGrievances.map((g) => g.grievanceNumber));
    const newFromLocal = localGrievances.filter((g) => !existing.has(g.grievanceNumber));
    return [...newFromLocal, ...initialGrievances];
  }, [initialGrievances, localGrievances]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const total = allGrievances.length;
    const inProgress = allGrievances.filter((g) => g.status === 'IN_PROGRESS' || g.status === 'SUBMITTED').length;
    const critical = allGrievances.filter((g) => g.priority === 'CRITICAL' || (g.riskPrediction?.riskScore || 0) >= 80).length;
    const resolved = allGrievances.filter((g) => g.status === 'RESOLVED').length;
    return { total, inProgress, critical, resolved };
  }, [allGrievances]);

  // Filtered List
  const filteredGrievances = useMemo(() => {
    return allGrievances.filter((g) => {
      // 1. Status Filter
      if (selectedStatus !== 'ALL') {
        if (selectedStatus === 'IN_PROGRESS') {
          if (g.status !== 'IN_PROGRESS' && g.status !== 'SUBMITTED') return false;
        } else if (g.status !== selectedStatus) {
          return false;
        }
      }

      // 2. City Filter
      if (selectedCity !== 'ALL') {
        const cityLower = selectedCity.toLowerCase();
        const dist = (g.location?.district || '').toLowerCase();
        const muni = (g.location?.municipality || '').toLowerCase();
        const state = (g.location?.state || '').toLowerCase();
        const ward = (g.location?.ward || '').toLowerCase();
        const address = (g.location?.address || '').toLowerCase();

        const matchesCity = dist.includes(cityLower) || 
                            muni.includes(cityLower) || 
                            state.includes(cityLower) ||
                            ward.includes(cityLower) ||
                            address.includes(cityLower);
        if (!matchesCity) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = g.title.toLowerCase().includes(q);
        const matchNumber = g.grievanceNumber.toLowerCase().includes(q);
        const matchDesc = g.description.toLowerCase().includes(q);
        const matchWard = (g.location?.ward || '').toLowerCase().includes(q);
        const matchCity = (g.location?.district || '').toLowerCase().includes(q);
        const matchDept = g.department.name.toLowerCase().includes(q);

        if (!matchTitle && !matchNumber && !matchDesc && !matchWard && !matchCity && !matchDept) {
          return false;
        }
      }

      return true;
    });
  }, [initialGrievances, selectedStatus, selectedCity, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
              CITIZEN CIVIC PORTAL
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
              PAN-INDIA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of public complaints, SLA compliance deadlines, and cross-departmental accountability.
          </p>
        </div>

        <a
          href="/citizen/grievances/new"
          className="flex items-center justify-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide shadow-gold-glow transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>File New Grievance</span>
        </a>
      </div>

      {/* 2. Direct ID Tracker Search Banner */}
      <div className="bg-gradient-to-r from-dark-900 to-dark-850 border border-gold-500/30 rounded-xl p-4 sm:p-5 shadow-card-dark">
        <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-gold-400 absolute left-3 top-3" />
            <input
              type="text"
              value={trackingIdInput}
              onChange={(e) => setTrackingIdInput(e.target.value)}
              placeholder="Enter Grievance Tracking ID (e.g., GRV-2026-MUM-01, GRV-2026-DEL-01, GRV-2026-0001)..."
              className="w-full bg-dark-950 border border-dark-750 text-xs text-white rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-gold-500 placeholder:text-slate-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-dark-800 hover:bg-gold-500 hover:text-black text-white border border-dark-700 hover:border-gold-500 px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 flex-shrink-0"
          >
            <span>Track Status Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 3. KPI Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-dark-900 border border-dark-800 rounded-xl p-3.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Total Filed
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-mono font-black text-white">{kpis.total}</span>
            <span className="text-[10px] text-slate-400">cases</span>
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-xl p-3.5">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block flex items-center gap-1">
            <Clock className="w-3 h-3" /> Under Action
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-mono font-black text-amber-400">{kpis.inProgress}</span>
            <span className="text-[10px] text-slate-400">in SLA</span>
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-xl p-3.5">
          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Critical Attention
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-mono font-black text-rose-400">{kpis.critical}</span>
            <span className="text-[10px] text-slate-400">monitored</span>
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-xl p-3.5">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-mono font-black text-emerald-400">{kpis.resolved}</span>
            <span className="text-[10px] text-slate-400">closed</span>
          </div>
        </div>
      </div>

      {/* 4. Filter Toolbar: Search, City Selector & Status Tabs */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keyword, ward, department, or description..."
              className="w-full bg-dark-950 border border-dark-750 text-xs text-white rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-gold-500 placeholder:text-slate-500"
            />
          </div>

          {/* City Filter Dropdown */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-gold-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-dark-950 border border-dark-750 text-xs text-white rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-gold-500"
              >
                <option value="ALL">All Cities (Pan-India)</option>
                {CITIES_DATA.map((c) => (
                  <option key={c.id} value={c.name.split(' ')[0]}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-dark-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-2">Status:</span>
          {[
            { id: 'ALL', label: 'All Cases' },
            { id: 'SUBMITTED', label: 'Submitted' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'TRANSFERRED', label: 'Transferred / Escalated' },
            { id: 'RESOLVED', label: 'Resolved' },
          ].map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gold-500 text-black shadow-gold-glow'
                    : 'bg-dark-950 text-slate-400 hover:text-white border border-dark-800 hover:border-dark-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Grievances Card Listing */}
      <div className="space-y-3">
        {filteredGrievances.length > 0 ? (
          filteredGrievances.map((g) => {
            const riskScore = g.riskPrediction?.riskScore || 50;
            const city = g.location?.district || 'Bengaluru';
            const state = g.location?.state || 'Karnataka';
            const municipality = g.location?.municipality || 'Municipal Body';
            const ward = g.location?.ward || 'Central Zone';
            const address = g.location?.address;

            // Status Styling
            let statusBadgeClass = 'bg-dark-800 text-slate-300 border-dark-700';
            if (g.status === 'RESOLVED') {
              statusBadgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            } else if (g.status === 'TRANSFERRED') {
              statusBadgeClass = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
            } else if (g.status === 'IN_PROGRESS') {
              statusBadgeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            } else if (g.status === 'SUBMITTED') {
              statusBadgeClass = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            }

            return (
              <div
                key={g.id}
                className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-4 sm:p-5 shadow-card-dark transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-gold-400">
                      {g.grievanceNumber}
                    </span>

                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold border ${statusBadgeClass}`}>
                      {g.status}
                    </span>

                    {/* City & State Badge */}
                    <span className="px-2 py-0.5 rounded bg-dark-950 text-slate-300 font-mono text-[10px] font-semibold border border-dark-800 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-gold-400" />
                      {city}{state ? `, ${state}` : ''}
                    </span>

                    {/* Municipality Badge */}
                    {municipality && (
                      <span className="px-2 py-0.5 rounded bg-dark-950 text-slate-400 font-mono text-[10px] border border-dark-800 hidden sm:inline">
                        {municipality.split('(')[0].trim()}
                      </span>
                    )}

                    <span className="text-[11px] text-slate-500 ml-auto sm:ml-0" suppressHydrationWarning>
                      Filed on {formatDate(g.createdAt)}
                    </span>
                  </div>

                  {/* Grievance Title */}
                  <h3 className="text-sm font-bold text-white hover:text-gold-400 transition-colors">
                    <a href={`/grievances/${g.grievanceNumber}`}>{g.title}</a>
                  </h3>

                  {/* Location & Department Meta */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span className="text-gold-400 font-semibold">{g.department.name}</span>
                    <span>•</span>
                    <span className="text-slate-300 font-medium">
                      {ward}
                    </span>
                    {address && (
                      <>
                        <span>•</span>
                        <span className="text-slate-400 truncate max-w-xs">{address}</span>
                      </>
                    )}
                    <span>•</span>
                    <span className="text-slate-400 font-mono text-[11px]" suppressHydrationWarning>
                      SLA Target: {formatDate(g.slaDeadline)}
                    </span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-dark-800">
                  <a
                    href={`/reports/visual-evidence/${g.grievanceNumber}`}
                    className="bg-dark-950 hover:bg-dark-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-dark-750 transition flex items-center gap-1"
                    title="View Visual Evidence Report"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dossier</span>
                  </a>

                  <a
                    href={`/grievances/${g.grievanceNumber}`}
                    className="bg-gold-500 hover:bg-gold-400 text-black px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-gold-glow transition flex items-center gap-1"
                  >
                    <span>View Timeline</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-dark-800 border border-dark-700 text-slate-400 mx-auto flex items-center justify-center">
              <Filter className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold text-white">No Grievances Found Matching Filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No complaint matched city &quot;{selectedCity}&quot; with status &quot;{selectedStatus}&quot;. Try resetting filters or register a new issue.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('ALL');
                  setSelectedStatus('ALL');
                }}
                className="bg-dark-800 hover:bg-dark-750 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-dark-700 transition"
              >
                Reset All Filters
              </button>
              <a
                href="/citizen/grievances/new"
                className="bg-gold-500 hover:bg-gold-400 text-black px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-gold-glow transition flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>File Grievance in {selectedCity !== 'ALL' ? selectedCity : 'Your City'}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
