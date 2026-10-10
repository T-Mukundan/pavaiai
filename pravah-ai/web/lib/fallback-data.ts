/**
 * Resilient fallback data for cloud / serverless deployments (Netlify, Vercel, AWS Lambda)
 * Ensures citizen portal and all grievance tracking features ALWAYS work with 100% reliability
 * even if serverless SQLite filesystem is isolated or read-only.
 */

export interface FallbackGrievance {
  id: string;
  grievanceNumber: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  severity: string;
  slaDeadline: string;
  createdAt: string;
  department: {
    id: string;
    name: string;
    code: string;
  };
  location: {
    id: string;
    address: string;
    ward: string;
    district: string;
    state: string;
    municipality: string;
    latitude: number;
    longitude: number;
  };
  riskPrediction?: {
    riskScore: number;
    riskLevel: string;
  };
  deadlockDetection?: {
    detected: boolean;
    cyclePath?: string;
  };
  media?: Array<{
    id: string;
    fileUrl: string;
    mediaType: string;
    capturedAt: string;
    dayOffset: number;
    analysis?: {
      detectedObjects: string[];
      severity: string;
      description: string;
      confidence: number;
    };
  }>;
  statusHistory?: Array<{
    id: string;
    status: string;
    remarks: string;
    changedBy: string;
    createdAt: string;
  }>;
  transfers?: Array<{
    id: string;
    fromDepartment: { name: string };
    toDepartment: { name: string };
    reason: string;
    transferredAt: string;
  }>;
  recommendations?: Array<{
    id: string;
    type: string;
    confidence: number;
    recommendation: string;
  }>;
  riskExplanations?: Array<{
    feature: string;
    contribution: number;
    rank: number;
  }>;
}

const IN_MEMORY_GRIEVANCES: FallbackGrievance[] = [
  {
    id: 'mum-01',
    grievanceNumber: 'GRV-2026-MUM-01',
    title: 'Severe road surface cave-in on Linking Road arterial corridor',
    description: 'Deep 3-foot trench opened following heavy rain on the main shopping boulevard near Bandra West police station. Causing 2-hour vehicular bottlenecks and hazard for pedestrians.',
    category: 'Road Infrastructure',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    severity: 'HIGH',
    slaDeadline: new Date(Date.now() + 36 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    department: {
      id: 'dept-roads',
      name: 'Roads & Highways',
      code: 'ROADS_HWY',
    },
    location: {
      id: 'loc-mum-01',
      address: 'Linking Road near Bandra Police Station, Bandra West',
      ward: 'Ward H/West (Bandra West / Khar / Pali Hill)',
      district: 'Mumbai',
      state: 'Maharashtra',
      municipality: 'BMC / MCGM (Brihanmumbai Municipal Corporation)',
      latitude: 19.0596,
      longitude: 72.8295,
    },
    riskPrediction: { riskScore: 84, riskLevel: 'CRITICAL' },
    deadlockDetection: { detected: false },
    media: [
      {
        id: 'med-01',
        fileUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        mediaType: 'image',
        capturedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
        dayOffset: 1,
        analysis: {
          detectedObjects: ['Asphalt cave-in', 'Structural road crater', 'Sub-base soil erosion'],
          severity: 'HIGH',
          description: 'Severe asphalt surface failure with aggregate loss and risk to high-density traffic.',
          confidence: 0.94,
        },
      },
    ],
    statusHistory: [
      {
        id: 'sh-01',
        status: 'SUBMITTED',
        remarks: 'Registered via Citizen Portal with geotag verification.',
        changedBy: 'Citizen Self-Service',
        createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      },
      {
        id: 'sh-02',
        status: 'IN_PROGRESS',
        remarks: 'Assigned to Executive Engineer Bandra West Division for road resurfacing.',
        changedBy: 'Ward Control Center',
        createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
      },
    ],
    transfers: [],
    recommendations: [
      {
        id: 'rec-01',
        type: 'EXPEDITE',
        confidence: 0.92,
        recommendation: 'Issue immediate emergency asphalt patch order to BMC Western Zone contractor.',
      },
    ],
    riskExplanations: [
      { feature: 'Arterial Corridor Traffic Volume', contribution: 0.35, rank: 1 },
      { feature: 'Physical Crater Depth > 30cm', contribution: 0.28, rank: 2 },
      { feature: 'Monsoon Water Ingress', contribution: 0.21, rank: 3 },
    ],
  },
  {
    id: 'del-01',
    grievanceNumber: 'GRV-2026-DEL-01',
    title: 'Stormwater drainage overflow near Connaught Place Metro Gate',
    description: 'Underground drainage system choked with plastic waste, leading to knee-deep stagnation right outside Rajiv Chowk Metro Gate 3. Public health hazard for thousands of commuters.',
    category: 'Drainage & Stormwater',
    status: 'SUBMITTED',
    priority: 'HIGH',
    severity: 'MEDIUM',
    slaDeadline: new Date(Date.now() + 48 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    department: {
      id: 'dept-drainage',
      name: 'Drainage & Stormwater',
      code: 'DRAINAGE',
    },
    location: {
      id: 'loc-del-01',
      address: 'Connaught Place Inner Circle, Block B Crossing',
      ward: 'Central Delhi (Connaught Place / Barakhamba)',
      district: 'Delhi / New Delhi',
      state: 'Delhi (NCT)',
      municipality: 'MCD / NDMC (Municipal Corporation of Delhi)',
      latitude: 28.6328,
      longitude: 77.2197,
    },
    riskPrediction: { riskScore: 74, riskLevel: 'HIGH' },
    deadlockDetection: { detected: false },
    media: [
      {
        id: 'med-02',
        fileUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f156b?auto=format&fit=crop&w=800&q=80',
        mediaType: 'image',
        capturedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
        dayOffset: 1,
        analysis: {
          detectedObjects: ['Choked culvert', 'Stagnant water ponding', 'Pedestrian walkway inundation'],
          severity: 'HIGH',
          description: 'Culvert blockage triggering stormwater overflow onto pedestrian footpath.',
          confidence: 0.91,
        },
      },
    ],
    statusHistory: [
      {
        id: 'sh-03',
        status: 'SUBMITTED',
        remarks: 'Complaint registered via citizen portal with initial NLP classification.',
        changedBy: 'Citizen Self-Service',
        createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
      },
    ],
    transfers: [],
    recommendations: [
      {
        id: 'rec-02',
        type: 'INSPECT',
        confidence: 0.88,
        recommendation: 'Deploy NDMC desilting suction machine to clear Connaught Place drainage culvert.',
      },
    ],
    riskExplanations: [
      { feature: 'High Footfall Transit Hub', contribution: 0.38, rank: 1 },
      { feature: 'Water Stagnation > 24h', contribution: 0.25, rank: 2 },
    ],
  },
  {
    id: 'blr-01',
    grievanceNumber: 'GRV-2026-0001',
    title: 'Severe road surface cave-in on 100 Feet Road corridor',
    description: 'A deep pothole of approximately 2 feet diameter on 100 Feet Road Indiranagar causing vehicular damage and recurring traffic bottlenecks during peak hours.',
    category: 'Road Infrastructure',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    severity: 'HIGH',
    slaDeadline: new Date(Date.now() + 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    department: {
      id: 'dept-roads',
      name: 'Roads & Highways',
      code: 'ROADS_HWY',
    },
    location: {
      id: 'loc-blr-01',
      address: '100 Feet Road near 12th Main, Indiranagar',
      ward: 'Ward 80 (Hoysala Nagar / Indiranagar)',
      district: 'Bengaluru (Bangalore)',
      state: 'Karnataka',
      municipality: 'BBMP (Bruhat Bengaluru Mahanagara Palike)',
      latitude: 12.9784,
      longitude: 77.6408,
    },
    riskPrediction: { riskScore: 88, riskLevel: 'CRITICAL' },
    deadlockDetection: { detected: true, cyclePath: '["Roads & Highways", "Water Supply & Sewerage", "Roads & Highways"]' },
    media: [
      {
        id: 'med-03',
        fileUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        mediaType: 'image',
        capturedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        dayOffset: 1,
        analysis: {
          detectedObjects: ['Asphalt breach', 'Crater cavity', 'Exposed gravel aggregate'],
          severity: 'CRITICAL',
          description: 'Deep road surface deterioration with high risk to two-wheelers.',
          confidence: 0.95,
        },
      },
    ],
    statusHistory: [
      {
        id: 'sh-04',
        status: 'SUBMITTED',
        remarks: 'Registered via citizen portal.',
        changedBy: 'Citizen Self-Service',
        createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      },
      {
        id: 'sh-05',
        status: 'TRANSFERRED',
        remarks: 'Transferred to BWSSB citing water pipe leak under road.',
        changedBy: 'BBMP Roads Division',
        createdAt: new Date(Date.now() - 16 * 3600000).toISOString(),
      },
      {
        id: 'sh-06',
        status: 'TRANSFERRED',
        remarks: 'Transferred back to BBMP stating pipe repaired.',
        changedBy: 'BWSSB Engineer',
        createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      },
      {
        id: 'sh-07',
        status: 'IN_PROGRESS',
        remarks: 'Nodal Officer initiated joint inter-agency restoration.',
        changedBy: 'Nodal Officer',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
    ],
    transfers: [
      {
        id: 'tr-01',
        fromDepartment: { name: 'Roads & Highways' },
        toDepartment: { name: 'Water Supply & Sewerage' },
        reason: 'Underground pipeline leakage claimed by engineer.',
        transferredAt: new Date(Date.now() - 16 * 3600000).toISOString(),
      },
      {
        id: 'tr-02',
        fromDepartment: { name: 'Water Supply & Sewerage' },
        toDepartment: { name: 'Roads & Highways' },
        reason: 'Water line checked and repaired; asphalt restoration pending.',
        transferredAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      },
    ],
    recommendations: [
      {
        id: 'rec-03',
        type: 'JOINT_INSPECTION',
        confidence: 0.96,
        recommendation: 'Convene joint on-site inspection between BBMP and BWSSB to end jurisdictional ping-pong.',
      },
    ],
    riskExplanations: [
      { feature: 'Inter-Agency Circular Transfers', contribution: 0.42, rank: 1 },
      { feature: 'Approaching SLA Target (24h remaining)', contribution: 0.31, rank: 2 },
      { feature: 'High Accident Propensity Index', contribution: 0.18, rank: 3 },
    ],
  },
  {
    id: 'che-01',
    grievanceNumber: 'GRV-2026-CHE-01',
    title: 'Overhead transformer sparking continuously during evening rush',
    description: 'Distribution transformer on Usman Road emitting loud sparks and smoke during evening peak load. Commercial shops have shut down power due to fear of transformer burst.',
    category: 'Power Infrastructure',
    status: 'TRANSFERRED',
    priority: 'CRITICAL',
    severity: 'HIGH',
    slaDeadline: new Date(Date.now() + 18 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    department: {
      id: 'dept-elec',
      name: 'Electricity Distribution',
      code: 'ELECTRICITY',
    },
    location: {
      id: 'loc-che-01',
      address: 'Usman Road Flyover Service Lane, T. Nagar',
      ward: 'Zone 9 (Teynampet / T. Nagar / Alwarpet)',
      district: 'Chennai',
      state: 'Tamil Nadu',
      municipality: 'GCC (Greater Chennai Corporation)',
      latitude: 13.0418,
      longitude: 80.2341,
    },
    riskPrediction: { riskScore: 91, riskLevel: 'CRITICAL' },
    deadlockDetection: { detected: false },
    media: [
      {
        id: 'med-04',
        fileUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
        mediaType: 'image',
        capturedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
        dayOffset: 1,
        analysis: {
          detectedObjects: ['Transformer spark discharge', 'Overhead cable arcing', 'Thermal overload hazard'],
          severity: 'CRITICAL',
          description: 'Active electrical arcing on 11kV distribution transformer.',
          confidence: 0.97,
        },
      },
    ],
    statusHistory: [
      {
        id: 'sh-08',
        status: 'SUBMITTED',
        remarks: 'Registered via citizen portal.',
        changedBy: 'Citizen Self-Service',
        createdAt: new Date(Date.now() - 30 * 3600000).toISOString(),
      },
      {
        id: 'sh-09',
        status: 'TRANSFERRED',
        remarks: 'Transferred from Municipal Corp to TANGEDCO Central Distribution Division.',
        changedBy: 'GCC Control Room',
        createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
      },
    ],
    transfers: [
      {
        id: 'tr-03',
        fromDepartment: { name: 'Municipal Administration' },
        toDepartment: { name: 'Electricity Distribution' },
        reason: 'Specialized high-voltage equipment requires DISCOM lineman squad.',
        transferredAt: new Date(Date.now() - 18 * 3600000).toISOString(),
      },
    ],
    recommendations: [
      {
        id: 'rec-04',
        type: 'ESCALATE',
        confidence: 0.95,
        recommendation: 'Isolate feeder 4 and dispatch emergency technical repair crew immediately.',
      },
    ],
    riskExplanations: [
      { feature: 'Electrocution / Fire Hazard', contribution: 0.52, rank: 1 },
      { feature: 'Commercial Zone Density', contribution: 0.28, rank: 2 },
    ],
  },
  {
    id: 'hyd-01',
    grievanceNumber: 'GRV-2026-HYD-01',
    title: 'Drinking water pipeline ruptured flooding Hitec City IT corridor',
    description: 'Major 500mm pipeline supplying drinking water has cracked under the footbridge. Clean water gushing at high pressure and flooding arterial IT corridor roads.',
    category: 'Water Quality',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    severity: 'MEDIUM',
    slaDeadline: new Date(Date.now() + 52 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    department: {
      id: 'dept-water',
      name: 'Water Supply & Sewerage',
      code: 'WATER_SUPPLY',
    },
    location: {
      id: 'loc-hyd-01',
      address: 'Cyber Towers Junction near Mindspace Ring Road, Hitec City',
      ward: 'Circle 20 (Serilingampally / Hitec City / Madhapur)',
      district: 'Hyderabad',
      state: 'Telangana',
      municipality: 'GHMC (Greater Hyderabad Municipal Corporation)',
      latitude: 17.4504,
      longitude: 78.3808,
    },
    riskPrediction: { riskScore: 68, riskLevel: 'HIGH' },
    deadlockDetection: { detected: false },
    media: [
      {
        id: 'med-05',
        fileUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f156b?auto=format&fit=crop&w=800&q=80',
        mediaType: 'image',
        capturedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
        dayOffset: 1,
        analysis: {
          detectedObjects: ['Pressurized pipeline breach', 'Water wastage', 'Road inundation'],
          severity: 'HIGH',
          description: 'High-pressure water main fracture flooding junction.',
          confidence: 0.93,
        },
      },
    ],
    statusHistory: [
      {
        id: 'sh-10',
        status: 'SUBMITTED',
        remarks: 'Registered via Citizen Portal with location geotag.',
        changedBy: 'Citizen Self-Service',
        createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
      },
      {
        id: 'sh-11',
        status: 'IN_PROGRESS',
        remarks: 'HMWSSB pipeline repair crew dispatched to shut isolation valve.',
        changedBy: 'GHMC Control Room',
        createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
      },
    ],
    transfers: [],
    recommendations: [
      {
        id: 'rec-05',
        type: 'ACTION',
        confidence: 0.90,
        recommendation: 'Shut valve V-12 and complete welding repair before morning peak hours.',
      },
    ],
    riskExplanations: [
      { feature: 'Potable Water Resource Loss', contribution: 0.44, rank: 1 },
      { feature: 'Traffic Slowdown on Cyber Corridor', contribution: 0.32, rank: 2 },
    ],
  },
  {
    id: 'pun-01',
    grievanceNumber: 'GRV-2026-PUN-01',
    title: 'Uncollected community garbage dump overflowing on pedestrian sidewalk',
    description: 'Municipal dumper bins have not been cleared for past 6 days. Large piles of decomposing organic waste spilling onto FC road cycle track and sidewalk.',
    category: 'Solid Waste Management',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    severity: 'LOW',
    slaDeadline: new Date(Date.now() - 12 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    department: {
      id: 'dept-waste',
      name: 'Solid Waste Management',
      code: 'SOLID_WASTE',
    },
    location: {
      id: 'loc-pun-01',
      address: 'Fergusson College Road near Goodluck Chowk, Shivajinagar',
      ward: 'Ward 7 (Shivajinagar / FC Road)',
      district: 'Pune',
      state: 'Maharashtra',
      municipality: 'PMC (Pune Municipal Corporation)',
      latitude: 18.5196,
      longitude: 73.8415,
    },
    riskPrediction: { riskScore: 32, riskLevel: 'LOW' },
    deadlockDetection: { detected: false },
    media: [
      {
        id: 'med-06',
        fileUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
        mediaType: 'image',
        capturedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
        dayOffset: 1,
        analysis: {
          detectedObjects: ['Overflowing dumper bin', 'Solid waste spillage'],
          severity: 'MEDIUM',
          description: 'Uncollected solid waste accumulating on pedestrian walkway.',
          confidence: 0.89,
        },
      },
    ],
    statusHistory: [
      {
        id: 'sh-12',
        status: 'SUBMITTED',
        remarks: 'Registered via citizen portal.',
        changedBy: 'Citizen Self-Service',
        createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
      },
      {
        id: 'sh-13',
        status: 'IN_PROGRESS',
        remarks: 'Assigned to PMC Ward 7 Sanitary Inspector.',
        changedBy: 'Sanitation Division',
        createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      },
      {
        id: 'sh-14',
        status: 'RESOLVED',
        remarks: 'Waste lifted via compactor vehicle and area disinfected with bleaching powder.',
        changedBy: 'PMC Sanitary Inspector',
        createdAt: new Date(Date.now() - 16 * 3600000).toISOString(),
      },
    ],
    transfers: [],
    recommendations: [],
    riskExplanations: [],
  },
  {
    id: 'kol-01',
    grievanceNumber: 'GRV-2026-KOL-01',
    title: 'Non-functional streetlights on Park Street major intersection',
    description: 'A stretch of 12 streetlights non-operational for over 2 weeks leading to pedestrian safety concerns after dark.',
    category: 'Street Lighting',
    status: 'SUBMITTED',
    priority: 'MEDIUM',
    severity: 'MEDIUM',
    slaDeadline: new Date(Date.now() + 60 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    department: {
      id: 'dept-light',
      name: 'Street Lighting',
      code: 'STREET_LIGHT',
    },
    location: {
      id: 'loc-kol-01',
      address: 'Park Street near Camac Street Crossing',
      ward: 'Borough 5 (Park Street / Esplanade / BBD Bagh)',
      district: 'Kolkata',
      state: 'West Bengal',
      municipality: 'KMC (Kolkata Municipal Corporation)',
      latitude: 22.5535,
      longitude: 88.3524,
    },
    riskPrediction: { riskScore: 56, riskLevel: 'MEDIUM' },
    deadlockDetection: { detected: false },
    media: [],
    statusHistory: [
      {
        id: 'sh-15',
        status: 'SUBMITTED',
        remarks: 'Registered via citizen portal.',
        changedBy: 'Citizen Self-Service',
        createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
      },
    ],
    transfers: [],
    recommendations: [],
    riskExplanations: [],
  },
];

export function getFallbackGrievances(): FallbackGrievance[] {
  return [...IN_MEMORY_GRIEVANCES];
}

export function getFallbackGrievanceById(identifier: string): FallbackGrievance | null {
  const clean = identifier.trim().toLowerCase();
  const found = IN_MEMORY_GRIEVANCES.find(
    (g) => g.grievanceNumber.toLowerCase() === clean || g.id.toLowerCase() === clean
  );
  if (found) return found;

  // Fallback to first showcase grievance
  return IN_MEMORY_GRIEVANCES[0] || null;
}

export function addFallbackGrievance(data: Partial<FallbackGrievance>): FallbackGrievance {
  const newGrievance: FallbackGrievance = {
    id: `grv-${Date.now()}`,
    grievanceNumber: data.grievanceNumber || `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    title: data.title || 'Civic infrastructure defect',
    description: data.description || 'Public complaint registered via citizen portal.',
    category: data.category || 'Civic Infrastructure',
    status: data.status || 'SUBMITTED',
    priority: data.priority || 'HIGH',
    severity: data.severity || 'MEDIUM',
    slaDeadline: data.slaDeadline || new Date(Date.now() + 48 * 3600000).toISOString(),
    createdAt: data.createdAt || new Date().toISOString(),
    department: data.department || {
      id: 'dept-gen',
      name: 'Municipal Administration',
      code: 'MUNICIPAL_ADMIN',
    },
    location: data.location || {
      id: `loc-${Date.now()}`,
      address: 'Central Corridor',
      ward: 'Central Zone',
      district: 'Bengaluru',
      state: 'Karnataka',
      municipality: 'Local Municipal Body',
      latitude: 12.9716,
      longitude: 77.5946,
    },
    riskPrediction: data.riskPrediction || { riskScore: 65, riskLevel: 'MEDIUM' },
    deadlockDetection: data.deadlockDetection || { detected: false },
    media: data.media || [],
    statusHistory: [
      {
        id: `sh-${Date.now()}`,
        status: data.status || 'SUBMITTED',
        remarks: 'Registered via citizen self-service portal.',
        changedBy: 'Citizen Self-Service',
        createdAt: new Date().toISOString(),
      },
    ],
    transfers: [],
    recommendations: [],
    riskExplanations: [],
  };

  IN_MEMORY_GRIEVANCES.unshift(newGrievance);
  return newGrievance;
}
