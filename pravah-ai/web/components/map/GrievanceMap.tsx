'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  MapPin, 
  ArrowUpRight, 
  X, 
  Layers, 
  ShieldAlert, 
  Sparkles,
  ExternalLink,
  Flame
} from 'lucide-react';

interface GrievancePoint {
  id: string;
  grievanceNumber: string;
  title: string;
  category: string;
  departmentName: string;
  latitude: number;
  longitude: number;
  address: string;
  ward?: string;
  riskScore: number;
  status: string;
  severity: string;
  isDeadlocked?: boolean;
  isRecurring?: boolean;
  createdAt: string;
  imageUrl?: string;
}

interface GrievanceMapProps {
  grievances: GrievancePoint[];
  activeFilter?: string;
}

export default function GrievanceMap({ grievances, activeFilter = 'ALL' }: GrievanceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedGrievance, setSelectedGrievance] = useState<GrievancePoint | null>(null);
  const [activeLayer, setActiveLayer] = useState<string>('ALL');

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let L: any;
    import('leaflet').then((leafletModule) => {
      L = leafletModule.default || leafletModule;

      // Clean up previous map if already initialized
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: Bengaluru Urban Center (or first grievance)
      const centerLat = grievances[0]?.latitude || 12.9716;
      const centerLng = grievances[0]?.longitude || 77.5946;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Sleek Dark Canvas tile layer (100% Free, Zero Watermark, No API Key Required)
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri, OpenStreetMap contributors',
          maxZoom: 18,
        }
      ).addTo(map);

      // Add high-contrast road, ward & administrative boundary labels
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
        }
      ).addTo(map);

      mapInstanceRef.current = map;

      // Render Markers
      renderMarkers(L, map, grievances);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [grievances]);

  // Handle Layer/Filter Change
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;
    import('leaflet').then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      renderMarkers(L, mapInstanceRef.current, grievances);
    });
  }, [activeLayer]);

  const renderMarkers = (L: any, map: any, items: GrievancePoint[]) => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = items.filter((g) => {
      if (activeLayer === 'HIGH_RISK') return g.riskScore >= 75;
      if (activeLayer === 'DEADLOCK') return g.isDeadlocked;
      if (activeLayer === 'RECURRING') return g.isRecurring;
      if (activeLayer === 'SLA_BREACH') return g.status === 'TRANSFERRED' || g.riskScore >= 80;
      return true;
    });

    filtered.forEach((g) => {
      let pinColor = '#10b981'; // normal
      let pulseClass = '';
      let badgeLabel = `${g.riskScore}%`;

      if (g.isDeadlocked) {
        pinColor = '#a855f7'; // deadlock purple
        badgeLabel = 'DEADLOCK';
      } else if (g.riskScore >= 80) {
        pinColor = '#ef4444'; // critical red
        pulseClass = 'animate-red-pulse';
        badgeLabel = `${g.riskScore}% RISK`;
      } else if (g.isRecurring) {
        pinColor = '#f5c518'; // recurring amber
        badgeLabel = 'RECURRING';
      }

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div class="${pulseClass}" style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: ${pinColor};
              border: 2px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.8);
              cursor: pointer;
            ">
              <span style="font-size: 10px; font-weight: 800; color: #000000;">•</span>
            </div>
            <div style="
              position: absolute;
              bottom: 26px;
              white-space: nowrap;
              background: #0f1118;
              color: #f8fafc;
              font-size: 9px;
              font-family: monospace;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 4px;
              border: 1px solid ${pinColor};
              box-shadow: 0 2px 6px rgba(0,0,0,0.6);
            ">
              ${g.grievanceNumber} (${badgeLabel})
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([g.latitude, g.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedGrievance(g);
      });

      markersRef.current.push(marker);
    });
  };

  return (
    <div className="relative w-full h-[680px] rounded-xl overflow-hidden border border-dark-800 shadow-card-dark bg-dark-950">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer Switcher Controls (Top Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 bg-dark-950/90 border border-dark-750 backdrop-blur-md p-1.5 rounded-lg shadow-lg">
        <span className="text-[10px] font-mono font-bold text-slate-400 px-2 uppercase flex items-center gap-1">
          <Layers className="w-3 h-3 text-gold-400" /> Layers:
        </span>
        {[
          { id: 'ALL', label: 'All Markers', color: 'text-slate-200' },
          { id: 'HIGH_RISK', label: 'High Risk (>75%)', color: 'text-red-400' },
          { id: 'DEADLOCK', label: 'Deadlocks', color: 'text-purple-400' },
          { id: 'RECURRING', label: 'Recurring Clusters', color: 'text-gold-400' },
        ].map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
              activeLayer === layer.id
                ? 'bg-gold-500 text-black shadow-gold-glow'
                : `bg-dark-900 ${layer.color} hover:bg-dark-800 border border-dark-800`
            }`}
          >
            {layer.label}
          </button>
        ))}
      </div>

      {/* Hotspots Quick Switcher Button (Top Right) */}
      <div className="absolute top-4 right-16 z-10">
        <a
          href="/dashboard/map/hotspots"
          className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>DBSCAN Hotspots</span>
        </a>
      </div>

      {/* Slide-out Detailed Inspection Drawer (Section 9) */}
      {selectedGrievance && (
        <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-96 max-h-[90%] bg-dark-900/95 border border-dark-700 backdrop-blur-xl rounded-xl p-5 shadow-2xl z-20 overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between mb-3 border-b border-dark-800 pb-2">
            <div>
              <span className="font-mono text-xs font-bold text-gold-400">
                {selectedGrievance.grievanceNumber}
              </span>
              <div className="text-[10px] text-slate-400">
                {selectedGrievance.category}
              </div>
            </div>
            <button
              onClick={() => setSelectedGrievance(null)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-dark-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Evidence Image Thumbnail */}
          {selectedGrievance.imageUrl && (
            <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-dark-800">
              <img
                src={selectedGrievance.imageUrl}
                alt="Visual Evidence"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-mono">
                AI Visual Verified
              </span>
            </div>
          )}

          <h4 className="text-sm font-bold text-white mb-2 leading-snug">
            {selectedGrievance.title}
          </h4>

          <div className="space-y-2 text-xs text-slate-300 mb-4 bg-dark-950 p-3 rounded-lg border border-dark-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="font-medium text-white">{selectedGrievance.departmentName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Calculated Risk:</span>
              <span
                className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                  selectedGrievance.riskScore >= 80
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {selectedGrievance.riskScore}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="text-right truncate max-w-[180px] text-slate-200">
                {selectedGrievance.ward || selectedGrievance.address}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-semibold text-white uppercase">{selectedGrievance.status}</span>
            </div>
            {selectedGrievance.isDeadlocked && (
              <div className="pt-2 border-t border-dark-800 text-[11px] text-purple-400 flex items-center gap-1 font-semibold">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tarjan SCC Circular Deadlock Active</span>
              </div>
            )}
          </div>

          <a
            href={`/grievances/${selectedGrievance.grievanceNumber}`}
            className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-black py-2 rounded-lg text-xs font-bold tracking-wide shadow-gold-glow transition-all"
          >
            <span>Open Complaint 360° View</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
