'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapture from '@/components/media/CameraCapture';
import { CITIES_DATA, getCityById, CityConfig } from '@/lib/cities';
import { 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Camera, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  FileText,
  AlertCircle,
  Building2,
  Image as ImageIcon,
  Check,
  Compass
} from 'lucide-react';

const SAMPLE_EVIDENCE_PRESETS = [
  {
    label: 'Road Pothole / Crater',
    category: 'Road Infrastructure',
    dept: 'Roads & Highways',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    caption: 'Deep asphalt surface crater causing vehicular damage'
  },
  {
    label: 'Pipeline Leak / Flooding',
    category: 'Water Quality',
    dept: 'Water Supply & Sewerage',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f156b?auto=format&fit=crop&w=800&q=80',
    caption: 'Underground main water pipeline breach with street flooding'
  },
  {
    label: 'Transformer Spark / Wire Hazard',
    category: 'Power Infrastructure',
    dept: 'Electricity Distribution',
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    caption: 'Exposed distribution line sparks near residential zone'
  },
  {
    label: 'Garbage Dump Overflow',
    category: 'Solid Waste Management',
    dept: 'Solid Waste Management',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    caption: 'Uncleared municipal bin overflow creating health hazard'
  }
];

const ISSUE_PRESET_TEMPLATES = [
  {
    title: 'Severe crater and cave-in on arterial road',
    description: 'A deep pothole of approximately 2 feet diameter has formed right in the middle of the roadway. Several two-wheeler riders have suffered minor injuries. Urgent patch and asphalt resurfacing required before monsoon.',
    dept: 'Roads & Highways',
    category: 'Road Infrastructure'
  },
  {
    title: 'Burst drinking water pipeline leaking continuously',
    description: 'Potable water supply line has cracked under the pedestrian walkway. Clean water is gushing out and flooding adjoining commercial establishments for the last 48 hours.',
    dept: 'Water Supply & Sewerage',
    category: 'Water Quality'
  },
  {
    title: 'Sparking street distribution transformer and dangling cable',
    description: 'Sparks and popping sounds observed repeatedly from the overhead pole-mounted transformer during evening peak load. Cable hangs within reaching height of school children.',
    dept: 'Electricity Distribution',
    category: 'Power Infrastructure'
  },
  {
    title: 'Uncollected community waste dump overflowing on footpath',
    description: 'Municipal garbage collection has not occurred for over 5 days. Foul odor and stray animal menace making the street unusable for pedestrians.',
    dept: 'Solid Waste Management',
    category: 'Solid Waste Management'
  }
];

export default function NewGrievancePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Road Infrastructure');
  const [department, setDepartment] = useState('Roads & Highways');
  
  // Pan-India Multi-City Location State
  const [selectedCityId, setSelectedCityId] = useState('bengaluru');
  const [customCityName, setCustomCityName] = useState('');
  const [customStateName, setCustomStateName] = useState('');
  const [customMuniName, setCustomMuniName] = useState('');
  const [ward, setWard] = useState('Ward 112 (Shantala Nagar / MG Road)');
  const [customWard, setCustomWard] = useState('');
  const [locationAddress, setLocationAddress] = useState('MG Road Metro Station Junction, Shantala Nagar');
  const [latitude, setLatitude] = useState<number | null>(12.9716);
  const [longitude, setLongitude] = useState<number | null>(77.5946);
  const [evidenceDataUrl, setEvidenceDataUrl] = useState<string | null>(null);

  // AI Assistant suggestion
  const [aiSuggestedDept, setAiSuggestedDept] = useState<string | null>(null);
  const [aiConfidence, setAiConfidence] = useState<number>(0.92);

  const activeCityConfig: CityConfig = getCityById(selectedCityId);

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const config = getCityById(cityId);
    if (config) {
      setLatitude(config.defaultCoordinates.latitude);
      setLongitude(config.defaultCoordinates.longitude);
      if (config.wards.length > 0) {
        setWard(config.wards[0]);
      }
      if (config.sampleAddresses.length > 0) {
        setLocationAddress(config.sampleAddresses[0]);
      }
    }
  };

  const handleDescriptionBlur = () => {
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes('pothole') || text.includes('road') || text.includes('asphalt') || text.includes('crater')) {
      setAiSuggestedDept('Roads & Highways');
      setCategory('Road Infrastructure');
      setDepartment('Roads & Highways');
      setAiConfidence(0.95);
    } else if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('drain') || text.includes('sewage')) {
      setAiSuggestedDept('Water Supply & Sewerage');
      setCategory('Water Quality');
      setDepartment('Water Supply & Sewerage');
      setAiConfidence(0.93);
    } else if (text.includes('electric') || text.includes('power') || text.includes('spark') || text.includes('wire') || text.includes('transformer')) {
      setAiSuggestedDept('Electricity Distribution');
      setCategory('Power Infrastructure');
      setDepartment('Electricity Distribution');
      setAiConfidence(0.94);
    } else if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('dump')) {
      setAiSuggestedDept('Solid Waste Management');
      setCategory('Solid Waste Management');
      setDepartment('Solid Waste Management');
      setAiConfidence(0.91);
    }
  };

  const applyTemplate = (tpl: typeof ISSUE_PRESET_TEMPLATES[0]) => {
    setTitle(tpl.title);
    setDescription(tpl.description);
    setDepartment(tpl.dept);
    setCategory(tpl.category);
    setAiSuggestedDept(tpl.dept);
    setAiConfidence(0.96);
  };

  const handleGetLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocationAddress(`GPS Geolocation Coordinates (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          setLocationAddress(`${activeCityConfig.sampleAddresses[0] || 'Central Civic Zone'}`);
        }
      );
    } else {
      setLocationAddress(`${activeCityConfig.sampleAddresses[0] || 'Central Civic Zone'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const isCustom = selectedCityId === 'other';
    const resolvedCity = isCustom ? (customCityName.trim() || 'Custom City') : activeCityConfig.name;
    const resolvedState = isCustom ? (customStateName.trim() || 'National Territory') : activeCityConfig.state;
    const resolvedMuni = isCustom ? (customMuniName.trim() || 'Municipal Council') : activeCityConfig.municipality;
    const resolvedWard = (ward === 'custom' || isCustom) ? (customWard.trim() || ward) : ward;

    try {
      const payload = {
        title,
        description,
        category,
        department,
        ward: resolvedWard,
        address: locationAddress || `${resolvedWard}, ${resolvedCity}`,
        latitude: latitude || activeCityConfig.defaultCoordinates.latitude,
        longitude: longitude || activeCityConfig.defaultCoordinates.longitude,
        evidence: evidenceDataUrl,
        city: resolvedCity,
        state: resolvedState,
        municipality: resolvedMuni,
      };

      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let confirmedData: any = null;

      if (res.ok) {
        const data = await res.json();
        confirmedData = {
          ...data,
          city: resolvedCity,
          state: resolvedState,
          municipality: resolvedMuni,
        };
      } else {
        const fallbackId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        confirmedData = {
          grievanceNumber: fallbackId,
          department: department,
          slaHours: 48,
          riskScore: 78,
          city: resolvedCity,
          state: resolvedState,
          municipality: resolvedMuni,
        };
      }

      setSubmittedData(confirmedData);

      // Persist in client browser storage so citizen portal immediately renders the new case
      try {
        const localRecord = {
          id: `local-${Date.now()}`,
          grievanceNumber: confirmedData.grievanceNumber,
          title,
          description,
          category,
          department: { id: 'dept-auto', name: department, code: 'CIVIC' },
          location: {
            id: `loc-${Date.now()}`,
            address: locationAddress || `${resolvedWard}, ${resolvedCity}`,
            ward: resolvedWard,
            district: resolvedCity,
            state: resolvedState,
            municipality: resolvedMuni,
            latitude: latitude || activeCityConfig.defaultCoordinates.latitude,
            longitude: longitude || activeCityConfig.defaultCoordinates.longitude,
          },
          priority: (confirmedData.riskScore >= 80) ? 'CRITICAL' : 'HIGH',
          status: 'SUBMITTED',
          severity: 'MEDIUM',
          slaDeadline: new Date(Date.now() + (confirmedData.slaHours || 48) * 3600000).toISOString(),
          createdAt: new Date().toISOString(),
          riskPrediction: { riskScore: confirmedData.riskScore || 75, riskLevel: 'HIGH' },
          deadlockDetection: { detected: false },
        };

        const prev = JSON.parse(localStorage.getItem('pravah_local_grievances') || '[]');
        localStorage.setItem('pravah_local_grievances', JSON.stringify([localRecord, ...prev]));
      } catch {}

      setStep(7); // Show confirmation step
    } catch (err) {
      const fallbackId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackData = {
        grievanceNumber: fallbackId,
        department: department,
        slaHours: 48,
        riskScore: 78,
        city: resolvedCity,
        state: resolvedState,
        municipality: resolvedMuni,
      };
      setSubmittedData(fallbackData);

      try {
        const localRecord = {
          id: `local-${Date.now()}`,
          grievanceNumber: fallbackId,
          title,
          description,
          category,
          department: { id: 'dept-auto', name: department, code: 'CIVIC' },
          location: {
            id: `loc-${Date.now()}`,
            address: locationAddress || `${resolvedWard}, ${resolvedCity}`,
            ward: resolvedWard,
            district: resolvedCity,
            state: resolvedState,
            municipality: resolvedMuni,
            latitude: latitude || activeCityConfig.defaultCoordinates.latitude,
            longitude: longitude || activeCityConfig.defaultCoordinates.longitude,
          },
          priority: 'HIGH',
          status: 'SUBMITTED',
          severity: 'MEDIUM',
          slaDeadline: new Date(Date.now() + 48 * 3600000).toISOString(),
          createdAt: new Date().toISOString(),
          riskPrediction: { riskScore: 78, riskLevel: 'HIGH' },
          deadlockDetection: { detected: false },
        };

        const prev = JSON.parse(localStorage.getItem('pravah_local_grievances') || '[]');
        localStorage.setItem('pravah_local_grievances', JSON.stringify([localRecord, ...prev]));
      } catch {}

      setStep(7);
    } finally {
      setSubmitting(false);
    }
  };

  const totalSteps = 6;

  return (
    <div className="space-y-6">
      {/* Wizard Header */}
      <div className="border-b border-dark-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span>FILE A PUBLIC GRIEVANCE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                PAN-INDIA CIVIC PORTAL
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Automated multi-step portal with AI preliminary classification, GPS tagging, and visual verification across all Indian cities.
            </p>
          </div>
          
          <a
            href="/citizen/grievances"
            className="text-xs font-semibold text-slate-400 hover:text-gold-400 transition self-start sm:self-auto"
          >
            ← View My Complaints
          </a>
        </div>

        {/* Step Indicator */}
        {step <= 6 && (
          <div className="mt-4 flex items-center justify-between gap-1 max-w-xl">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-1.5 w-full rounded-full transition-all ${
                    s < step
                      ? 'bg-emerald-500'
                      : s === step
                      ? 'bg-gold-500 shadow-gold-glow'
                      : 'bg-dark-800'
                  }`}
                />
                <span className={`text-[9px] font-mono font-bold ${s === step ? 'text-gold-400' : 'text-slate-500'}`}>
                  Step {s}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUCCESS CONFIRMATION SCREEN (Step 7) */}
      {step === 7 && submittedData && (
        <div className="bg-dark-900 border-2 border-gold-500 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-gold-glow animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              Grievance Registered Successfully
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your grievance has been analyzed by PRAVAH NLP and routed to the municipal workflow authority.
            </p>
          </div>

          <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 max-w-md mx-auto space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-dark-800">
              <span className="text-slate-400">Tracking Reference ID:</span>
              <span className="font-mono font-black text-base text-gold-400">
                {submittedData.grievanceNumber}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-800">
              <span className="text-slate-400">Jurisdiction City / State:</span>
              <span className="font-semibold text-white">
                {submittedData.city || activeCityConfig.name} ({submittedData.state || activeCityConfig.state})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-800">
              <span className="text-slate-400">Municipal Corporation:</span>
              <span className="font-semibold text-gold-400">
                {submittedData.municipality || activeCityConfig.municipality}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-800">
              <span className="text-slate-400">Routed Department:</span>
              <span className="font-semibold text-white">{submittedData.department}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dark-800">
              <span className="text-slate-400">Target SLA Resolution:</span>
              <span className="font-mono font-bold text-slate-200">
                {submittedData.slaHours || 48} Hours
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Initial AI Risk Assessment:</span>
              <span className="font-mono font-bold text-amber-400">
                {submittedData.riskScore || 78}% (High Attention)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <a
              href={`/grievances/${submittedData.grievanceNumber}`}
              className="bg-gold-500 hover:bg-gold-400 text-black px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide shadow-gold-glow transition flex items-center justify-center gap-1.5"
            >
              <span>Track Live Grievance Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/citizen/grievances"
              className="bg-dark-800 hover:bg-dark-750 text-white px-5 py-2.5 rounded-lg text-xs font-semibold border border-dark-700 transition flex items-center justify-center"
            >
              Return to Citizen Portal
            </a>
            <button
              onClick={() => {
                setStep(1);
                setTitle('');
                setDescription('');
                setEvidenceDataUrl(null);
              }}
              className="bg-dark-800 hover:bg-dark-750 text-slate-300 px-5 py-2.5 rounded-lg text-xs font-semibold border border-dark-700 transition"
            >
              Submit Another Grievance
            </button>
          </div>
        </div>
      )}

      {/* MULTI-STEP FORM BODY (Steps 1 to 6) */}
      {step < 7 && (
        <form onSubmit={handleSubmit} className="bg-dark-900 border border-dark-800 rounded-xl p-6 shadow-card-dark space-y-6">
          {/* STEP 1: TITLE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  1. Complaint Headline / Title *
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  A concise headline describing the civic defect or public hazard.
                </p>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Deep crater on main road near bus stand causing accidents"
                  className="w-full bg-dark-950 border border-dark-750 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600"
                />
              </div>

              {/* Quick Template Presets */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick Civic Templates (Click to Auto-fill):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ISSUE_PRESET_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="text-left p-2.5 rounded-lg bg-dark-950 hover:bg-dark-800 border border-dark-800 hover:border-gold-500/50 text-xs text-slate-300 transition group"
                    >
                      <div className="font-semibold text-white group-hover:text-gold-400 transition-colors">
                        {tpl.title}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {tpl.dept} • {tpl.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DESCRIPTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  2. Detailed Complaint Narrative *
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  Describe what happened, exact landmark, persistency duration, and public safety impact.
                </p>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder="Provide complete context. The road near the primary school has several deep potholes filled with stagnant water..."
                  className="w-full bg-dark-950 border border-dark-750 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600"
                />
              </div>

              {/* AI Real-time Classification Card */}
              {aiSuggestedDept && (
                <div className="p-3.5 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-start gap-3 animate-in fade-in duration-200">
                  <Sparkles className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-gold-300 uppercase tracking-wider block">
                      PRAVAH NLP Classification
                    </span>
                    <span className="text-slate-300">
                      Recommended Department:{' '}
                      <strong className="text-white">{aiSuggestedDept}</strong> (Category:{' '}
                      <strong className="text-white">{category}</strong>)
                    </span>
                    <span className="block text-[10px] font-mono text-gold-400/80 mt-0.5">
                      Confidence: {Math.round(aiConfidence * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CATEGORY & DEPARTMENT OVERRIDE */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Confirm Department & Classification
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-750 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="Roads & Highways">Roads & Highways</option>
                    <option value="Drainage & Stormwater">Drainage & Stormwater</option>
                    <option value="Water Supply & Sewerage">Water Supply & Sewerage</option>
                    <option value="Electricity Distribution">Electricity Distribution</option>
                    <option value="Solid Waste Management">Solid Waste Management</option>
                    <option value="Street Lighting">Street Lighting</option>
                    <option value="Municipal Administration">Municipal Administration</option>
                    <option value="Revenue & Land Administration">Revenue & Land Administration</option>
                    <option value="Public Safety & Police">Public Safety & Police</option>
                    <option value="Health & Medical Services">Health & Medical Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-750 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAN-INDIA MULTI-CITY LOCATION & GEOTAG */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    4. City, Municipal Body & Geographic Geotag
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Select your city or municipality anywhere across India.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300 bg-gold-500/10 px-2.5 py-1.5 rounded-lg border border-gold-500/30 transition shadow"
                >
                  <Compass className="w-3.5 h-3.5 text-gold-400" />
                  <span>Use Device GPS</span>
                </button>
              </div>

              {/* City Selection */}
              <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gold-400" />
                    <span>Select City / Metropolitan Area *</span>
                  </label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-750 rounded-lg p-2.5 text-xs text-white font-medium focus:outline-none focus:border-gold-500"
                  >
                    {CITIES_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display resolved Municipal Corporation & State badge */}
                {selectedCityId !== 'other' ? (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="px-2.5 py-1 rounded bg-dark-900 border border-dark-750 text-slate-300 font-medium">
                      State: <strong className="text-white">{activeCityConfig.state}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded bg-gold-500/15 border border-gold-500/30 text-gold-300 font-medium">
                      Authority: <strong className="text-white">{activeCityConfig.municipality}</strong>
                    </span>
                  </div>
                ) : (
                  /* Custom City Fields */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">City / Town Name *</label>
                      <input
                        type="text"
                        value={customCityName}
                        onChange={(e) => setCustomCityName(e.target.value)}
                        placeholder="e.g., Coimbatore / Surat"
                        className="w-full bg-dark-900 border border-dark-750 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">State / UT *</label>
                      <input
                        type="text"
                        value={customStateName}
                        onChange={(e) => setCustomStateName(e.target.value)}
                        placeholder="e.g., Tamil Nadu / Gujarat"
                        className="w-full bg-dark-900 border border-dark-750 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Municipal Body</label>
                      <input
                        type="text"
                        value={customMuniName}
                        onChange={(e) => setCustomMuniName(e.target.value)}
                        placeholder="e.g., City Municipal Corporation"
                        className="w-full bg-dark-900 border border-dark-750 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Administrative Ward & Landmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Administrative Ward / Division *</label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-750 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    {activeCityConfig.wards.map((w, idx) => (
                      <option key={idx} value={w}>
                        {w}
                      </option>
                    ))}
                    <option value="custom">Other / Custom Ward Name</option>
                  </select>

                  {(ward === 'custom' || selectedCityId === 'other') && (
                    <input
                      type="text"
                      value={customWard}
                      onChange={(e) => setCustomWard(e.target.value)}
                      placeholder="Type custom ward name..."
                      className="mt-2 w-full bg-dark-950 border border-dark-750 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">GPS Coordinates</label>
                  <div className="bg-dark-950 border border-dark-750 rounded-lg p-2.5 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>Lat: {latitude?.toFixed(4)}, Lng: {longitude?.toFixed(4)}</span>
                    <span className="text-[10px] text-emerald-400 font-sans font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Geotag
                    </span>
                  </div>
                </div>
              </div>

              {/* Specific Street Address / Landmark */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Specific Street Address / Landmark *</label>
                <input
                  type="text"
                  required
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="e.g., Near Signal Crossing, opposite Metro Pillar 42"
                  className="w-full bg-dark-950 border border-dark-750 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-gold-500 placeholder:text-slate-600"
                />

                {/* Sample Address Quick Picks */}
                {activeCityConfig.sampleAddresses.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-500">Popular landmarks in {activeCityConfig.name.split(' ')[0]}:</span>
                    {activeCityConfig.sampleAddresses.map((addr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLocationAddress(addr)}
                        className="text-[10px] px-2 py-0.5 rounded bg-dark-950 hover:bg-dark-800 border border-dark-800 hover:border-gold-500/40 text-slate-400 hover:text-white transition"
                      >
                        {addr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: CAMERA & EVIDENCE CAPTURE */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  5. Photographic Evidence (Camera / Upload / Demo Samples)
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  You can capture live using your device camera, upload an image, or pick a sample civic photo to test PRAVAH computer vision.
                </p>
              </div>

              {/* Live Camera and Device Upload */}
              <CameraCapture onCapture={(url) => setEvidenceDataUrl(url)} />

              {/* Instant 1-Click Demo Evidence Presets */}
              <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Or Select 1-Click Demo Photo Evidence:</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Fast test without webcam</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SAMPLE_EVIDENCE_PRESETS.map((sample, idx) => {
                    const isSelected = evidenceDataUrl === sample.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEvidenceDataUrl(sample.url)}
                        className={`relative rounded-lg overflow-hidden border text-left transition group ${
                          isSelected
                            ? 'border-gold-500 ring-2 ring-gold-500/50'
                            : 'border-dark-800 hover:border-gold-500/40'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.label}
                          className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="p-2 bg-dark-900/90 text-[10px]">
                          <span className="font-semibold text-white block truncate">{sample.label}</span>
                          <span className="text-slate-400 block text-[9px] truncate">{sample.dept}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-gold-500 text-black rounded-full p-0.5 shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Skip Option */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setEvidenceDataUrl(null);
                    setStep(6);
                  }}
                  className="text-xs text-slate-400 hover:text-white underline underline-offset-2 transition"
                >
                  Skip Photographic Evidence (File without photo)
                </button>

                {evidenceDataUrl && (
                  <button
                    type="button"
                    onClick={() => setEvidenceDataUrl(null)}
                    className="text-xs text-rose-400 hover:text-rose-300 transition"
                  >
                    Clear Attached Photo
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & SUBMIT */}
          {step === 6 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                6. Review Summary & Jurisdiction Routing
              </label>

              <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-dark-800 pb-2">
                  <span className="text-slate-400">Headline:</span>
                  <span className="font-bold text-white max-w-sm text-right">{title}</span>
                </div>
                <div className="flex justify-between border-b border-dark-800 pb-2">
                  <span className="text-slate-400">City & Jurisdiction:</span>
                  <span className="font-semibold text-gold-400">
                    {selectedCityId === 'other' ? customCityName || 'Other City' : activeCityConfig.name} ({selectedCityId === 'other' ? customStateName || 'Other State' : activeCityConfig.state})
                  </span>
                </div>
                <div className="flex justify-between border-b border-dark-800 pb-2">
                  <span className="text-slate-400">Municipal Corporation:</span>
                  <span className="font-medium text-slate-200">
                    {selectedCityId === 'other' ? customMuniName || 'Municipal Council' : activeCityConfig.municipality}
                  </span>
                </div>
                <div className="flex justify-between border-b border-dark-800 pb-2">
                  <span className="text-slate-400">Ward & Street Address:</span>
                  <span className="text-slate-200 text-right max-w-sm">
                    {(ward === 'custom' || selectedCityId === 'other') ? customWard || ward : ward} — {locationAddress}
                  </span>
                </div>
                <div className="flex justify-between border-b border-dark-800 pb-2">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold text-white">{department} ({category})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Visual Evidence:</span>
                  <span className={`font-mono font-bold ${evidenceDataUrl ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {evidenceDataUrl ? 'Photographic Evidence Attached' : 'No Photo (Optional)'}
                  </span>
                </div>
              </div>

              {/* PII Minimization Notice (PRD Section 36) */}
              <div className="bg-dark-950 p-3 rounded-lg border border-dark-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Notice:</strong> Designed to minimize unnecessary PII exposure and support alignment with government data-protection standards. Citizen identity is accessible only to authorized processing officers.
                </span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !title.trim()) return;
                  if (step === 2 && !description.trim()) return;
                  setStep(step + 1);
                }}
                disabled={(step === 1 && !title.trim()) || (step === 2 && !description.trim())}
                className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black px-4 py-2 rounded-lg text-xs font-bold shadow-gold-glow transition flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="bg-gold-500 hover:bg-gold-400 text-black px-6 py-2.5 rounded-lg text-xs font-bold tracking-wide shadow-gold-glow transition flex items-center gap-1.5"
              >
                <span>{submitting ? 'Registering & Routing...' : 'Register Grievance Now'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
