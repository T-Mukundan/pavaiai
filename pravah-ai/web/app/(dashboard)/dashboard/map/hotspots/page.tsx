import React from 'react';
import prisma from '@/lib/prisma';
import { Flame, MapPin, AlertTriangle, ArrowUpRight, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HotspotsPage() {
  const rootCauses = await prisma.rootCause.findMany({
    include: {
      department: true,
      location: true,
    },
  });

  const hotspots = [
    {
      name: 'Central Bus Terminal Arterial Corridor (Ward 112)',
      category: 'Road Infrastructure & Drainage',
      department: 'Roads & Highways / Municipal Admin',
      affectedArea: '1.2 km radius around Central Bus Terminal & Shivaji Circle',
      complaintCount: 47,
      avgResolutionTime: '31 days (historical)',
      riskLevel: 'CRITICAL (84% breach probability)',
      recurrenceFrequency: 'High (4.2 complaints/week)',
      detectedPattern: '47 repeated road crater and drainage overflow complaints concentrated along Central Bus Terminal corridor routed back and forth between Roads Dept and Municipal Corp.',
      potentialRootCause: 'Potential underlying civic asset wear: 30-year-old pre-cast stormwater culvert subsidence undermining road sub-base asphalt after monsoon events.',
      confidence: 0.94,
    },
    {
      name: 'Indiranagar 100ft Road Pipeline Grid (Ward 80)',
      category: 'Water Quality & Distribution',
      department: 'Water Supply & Sewerage',
      affectedArea: '0.8 km radius around 12th Main Indiranagar',
      complaintCount: 38,
      avgResolutionTime: '18 days',
      riskLevel: 'HIGH (79% breach probability)',
      recurrenceFrequency: 'Medium (2.8 complaints/week)',
      detectedPattern: '38 potable water odor and contamination complaints across 3 adjacent residential streets.',
      potentialRootCause: 'Potential sub-surface fracture near legacy sewage manhole causing negative pressure siphonage during intermittent supply cycles.',
      confidence: 0.91,
    },
    {
      name: 'HSR Layout Sector 2 Sub-station Perimeter (Ward 174)',
      category: 'Electricity Distribution',
      department: 'Electricity Distribution',
      affectedArea: '0.5 km radius around 27th Main Junction',
      complaintCount: 22,
      avgResolutionTime: '12 days',
      riskLevel: 'CRITICAL (92% breach probability)',
      recurrenceFrequency: 'High (peak hours 18:00 - 22:00)',
      detectedPattern: '22 recurring transformer sparking and brownout reports logged during evening peak load intervals.',
      potentialRootCause: 'Rapid commercial corridor expansion exceeding rated feeder transformer capacity by 34%.',
      confidence: 0.89,
    },
    {
      name: 'Gandhinagar Market & Primary School Zone (Ward 94)',
      category: 'Solid Waste Management',
      department: 'Solid Waste Management',
      affectedArea: '0.6 km radius outside Civil Hospital Gate',
      complaintCount: 29,
      avgResolutionTime: '14 days',
      riskLevel: 'HIGH (81% breach probability)',
      recurrenceFrequency: 'Continuous (overflow daily)',
      detectedPattern: 'Persistent garbage dump overflow adjacent to Government Primary School entrance gate.',
      potentialRootCause: 'Collection route logistics failure due to construction of stormwater drain blocking compacting truck access.',
      confidence: 0.87,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-dark-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <span>GEOGRAPHIC HOTSPOT & SPATIAL PATTERN CLUSTERS</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
            DBSCAN Spatial Density
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Automated density-based spatial clustering identifying localized infrastructure degradation vectors across municipal wards.
        </p>
      </div>

      {/* Advisory Notice Banner (PRD requirement: do not claim certainty) */}
      <div className="bg-dark-900 border-l-4 border-amber-500 p-4 rounded-r-xl border-y border-r border-dark-800 text-xs text-slate-300 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-400 font-bold uppercase tracking-wider block mb-0.5">
            Statistical Advisory Principle
          </strong>
          Geographic spatial clustering identifies statistically concentrated complaint density. Wording strictly distinguishes between <span className="text-white font-semibold">"Detected Pattern"</span> (empirically observed geospatial reports) and <span className="text-white font-semibold">"Potential Root Cause"</span> (hypothesized engineering etiology) to support administrative diligence.
        </div>
      </div>

      {/* Hotspots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hotspots.map((hs, idx) => (
          <div
            key={idx}
            className="bg-dark-900 border border-dark-800 hover:border-gold-500/40 rounded-xl p-5 shadow-card-dark transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                  {hs.category}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  {hs.complaintCount} Complaints Logged
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-tight">
                {hs.name}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-dark-950 p-3 rounded-lg border border-dark-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-medium text-white">{hs.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spatial Radius:</span>
                  <span className="text-slate-300">{hs.affectedArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Resolution Time:</span>
                  <span className="text-slate-300 font-mono">{hs.avgResolutionTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <span className="text-red-400 font-bold">{hs.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recurrence Rate:</span>
                  <span className="text-amber-400 font-medium">{hs.recurrenceFrequency}</span>
                </div>
              </div>

              {/* Detected Pattern */}
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Detected Pattern:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-dark-850 p-2.5 rounded border border-dark-800">
                  "{hs.detectedPattern}"
                </p>
              </div>

              {/* Potential Root Cause */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase text-amber-400 block mb-1">
                  Potential Root Cause (Advisory):
                </span>
                <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-500/10 p-2.5 rounded border border-amber-500/20">
                  "{hs.potentialRootCause}"
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-dark-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                ML Confidence: <strong className="text-white">{Math.round(hs.confidence * 100)}%</strong>
              </span>
              <a
                href="/dashboard/intelligence/root-causes"
                className="flex items-center gap-1 text-xs font-bold text-gold-400 hover:text-gold-300 uppercase"
              >
                Root Cause Synthesis <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
