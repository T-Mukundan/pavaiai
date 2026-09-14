import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In demo mode, store hashed or plain-demo password
const DEMO_PASSWORD_HASH = 'demoPassword123!';

async function main() {
  console.log('🌱 Starting PRAVAH-AI Database Seeding...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.deadlockDetection.deleteMany();
  await prisma.riskExplanation.deleteMany();
  await prisma.riskPrediction.deleteMany();
  await prisma.semanticCluster.deleteMany();
  await prisma.embedding.deleteMany();
  await prisma.mediaAnalysis.deleteMany();
  await prisma.media.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.grievanceStatusHistory.deleteMany();
  await prisma.rootCause.deleteMany();
  await prisma.grievance.deleteMany();
  await prisma.sLAConfig.deleteMany();
  await prisma.officer.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log('✅ Cleared old records');

  // 1. SEED DEPARTMENTS (25+ Hierarchical Departments)
  const departmentsData = [
    { code: 'CIVIC_INFRA', name: 'Civic Infrastructure', description: 'Civil works and urban structures' },
    { code: 'ROADS_HWY', name: 'Roads & Highways', description: 'Road maintenance, potholes, paving, highway safety' },
    { code: 'STREET_LIGHT', name: 'Street Lighting', description: 'Public lampposts, high-mast illumination, electrical lines' },
    { code: 'BRIDGES_FLY', name: 'Bridges & Flyovers', description: 'Structural maintenance of bridges and overpasses' },
    { code: 'DRAINAGE', name: 'Drainage & Stormwater', description: 'Storm drains, culverts, monsoon water accumulation' },
    { code: 'SOLID_WASTE', name: 'Solid Waste Management', description: 'Garbage collection, landfill logistics, litter bins' },
    { code: 'SANITATION', name: 'Sanitation & Public Health', description: 'Public toilets, anti-larval spraying, sanitation hygiene' },
    { code: 'WATER_SUPPLY', name: 'Water Supply & Sewerage', description: 'Potable water pipelines, sewage treatment, pressure issues' },
    { code: 'ELECTRICITY', name: 'Electricity Distribution', description: 'Transformers, high-voltage lines, load shedding, billing' },
    { code: 'MUNICIPAL_ADMIN', name: 'Municipal Administration', description: 'Local corporation zoning, trade licenses, civic permits' },
    { code: 'REVENUE_LAND', name: 'Revenue & Land Administration', description: 'Land registry, mutation, property records, encroached land' },
    { code: 'PROPERTY_TAX', name: 'Property Tax & Assessment', description: 'Tax assessments, receipts, property valuation disputes' },
    { code: 'PUBLIC_SAFETY', name: 'Public Safety & Police', description: 'Law and order, community policing, crime prevention' },
    { code: 'TRAFFIC_MGMT', name: 'Traffic Management', description: 'Signals, road markings, congestion, parking violations' },
    { code: 'FIRE_RESCUE', name: 'Fire & Emergency Rescue', description: 'Fire hazards, disaster response, building safety clearance' },
    { code: 'HEALTH_MED', name: 'Health & Medical Services', description: 'Public clinics, government civil hospitals, pharmacies' },
    { code: 'PUBLIC_HEALTH', name: 'Public Health & Epidemics', description: 'Vector control, food hygiene inspection, disease surveillance' },
    { code: 'SCHOOL_EDU', name: 'School Education', description: 'Govt school facilities, teacher attendance, mid-day meals' },
    { code: 'PUBLIC_TRANS', name: 'Public Transport & Metro', description: 'City bus frequency, bus stops, metro accessibility' },
    { code: 'POLLUTION_CTRL', name: 'Pollution Control Board', description: 'Industrial discharge, air quality index, acoustic noise' },
    { code: 'RURAL_DEV', name: 'Rural Development & Panchayati', description: 'Village roads, rural water schemes, farm pathways' },
    { code: 'SOCIAL_WELFARE', name: 'Social Welfare & Empowerment', description: 'Senior citizen welfare, pensions, disability support' },
    { code: 'FOOD_SUPPLIES', name: 'Food & Civil Supplies (PDS)', description: 'Ration cards, fair price shops, grain distribution' },
    { code: 'CONSUMER_AFF', name: 'Consumer Affairs & Weights', description: 'Measurement calibration, merchant fraud, fair practices' },
    { code: 'GENERAL_ADMIN', name: 'General Administration', description: 'Inter-departmental liaison, citizen coordination' },
  ];

  const depts: Record<string, any> = {};
  for (const item of departmentsData) {
    depts[item.code] = await prisma.department.create({
      data: item,
    });
  }
  console.log(`✅ Seeded ${Object.keys(depts).length} departments`);

  // 2. SEED SLA CONFIGS
  for (const code of Object.keys(depts)) {
    await prisma.sLAConfig.create({
      data: {
        departmentId: depts[code].id,
        category: depts[code].name,
        targetHours: code === 'ROADS_HWY' || code === 'DRAINAGE' ? 48 : 72,
        escalationHours: code === 'ROADS_HWY' ? 96 : 120,
      },
    });
  }

  // 3. SEED USERS & PERSONAS (5 Required System Personas)
  const usersData = [
    {
      name: 'Priya Sharma (Citizen)',
      email: 'citizen@pravah.demo',
      passwordHash: DEMO_PASSWORD_HASH,
      role: 'CITIZEN',
      phone: '+91 98765 43210',
    },
    {
      name: 'Vikram Malhotra, Executive Engineer',
      email: 'officer@pravah.demo',
      passwordHash: DEMO_PASSWORD_HASH,
      role: 'OFFICER',
      phone: '+91 98765 43211',
      departmentId: depts['ROADS_HWY'].id,
    },
    {
      name: 'Dr. Sunita Rao, IAS (Nodal Officer)',
      email: 'nodal@pravah.demo',
      passwordHash: DEMO_PASSWORD_HASH,
      role: 'NODAL_OFFICER',
      phone: '+91 98765 43212',
      departmentId: depts['GENERAL_ADMIN'].id,
    },
    {
      name: 'Aditya Sen, Chief Data Analyst',
      email: 'analyst@pravah.demo',
      passwordHash: DEMO_PASSWORD_HASH,
      role: 'ANALYST',
      phone: '+91 98765 43213',
      departmentId: depts['CIVIC_INFRA'].id,
    },
    {
      name: 'Super Admin Pravah',
      email: 'admin@pravah.demo',
      passwordHash: DEMO_PASSWORD_HASH,
      role: 'SUPER_ADMIN',
      phone: '+91 98765 43214',
      departmentId: depts['GENERAL_ADMIN'].id,
    },
  ];

  const seededUsers: Record<string, any> = {};
  for (const u of usersData) {
    seededUsers[u.email] = await prisma.user.create({ data: u });
  }

  // 4. SEED 20+ OFFICERS
  const officerNames = [
    { name: 'Vikram Malhotra', dept: 'ROADS_HWY', desig: 'Senior Executive Engineer', cap: 15, email: 'officer@pravah.demo' },
    { name: 'Rajesh Nair', dept: 'DRAINAGE', desig: 'Superintending Engineer', cap: 20, email: 'rajesh.drainage@pravah.demo' },
    { name: 'Ananya Deshmukh', dept: 'WATER_SUPPLY', desig: 'Assistant Executive Engineer', cap: 18, email: 'ananya.water@pravah.demo' },
    { name: 'Deepak Verma', dept: 'ELECTRICITY', desig: 'Divisional Engineer', cap: 22, email: 'deepak.power@pravah.demo' },
    { name: 'Kavita Joshi', dept: 'SOLID_WASTE', desig: 'Chief Sanitation Officer', cap: 25, email: 'kavita.swm@pravah.demo' },
    { name: 'Amitabh Bhattacharya', dept: 'MUNICIPAL_ADMIN', desig: 'Revenue Inspector', cap: 14, email: 'amitabh.muni@pravah.demo' },
    { name: 'Sneha Kulkarni', dept: 'REVENUE_LAND', desig: 'Tehsildar & Land Officer', cap: 16, email: 'sneha.land@pravah.demo' },
    { name: 'Sanjay Rawat', dept: 'STREET_LIGHT', desig: 'Junior Electrical Engineer', cap: 24, email: 'sanjay.light@pravah.demo' },
    { name: 'Meera Nambiar', dept: 'HEALTH_MED', desig: 'District Medical Officer', cap: 12, email: 'meera.health@pravah.demo' },
    { name: 'Prashant Iyer', dept: 'TRAFFIC_MGMT', desig: 'Assistant Commissioner of Police', cap: 20, email: 'prashant.traffic@pravah.demo' },
    { name: 'Rameshwar Patil', dept: 'ROADS_HWY', desig: 'Assistant Engineer (Zone 2)', cap: 18, email: 'rameshwar.roads@pravah.demo' },
    { name: 'Farhan Qureshi', dept: 'POLLUTION_CTRL', desig: 'Environmental Scientist', cap: 15, email: 'farhan.pcb@pravah.demo' },
    { name: 'Alok Trivedi', dept: 'FOOD_SUPPLIES', desig: 'Civil Supplies Officer', cap: 22, email: 'alok.food@pravah.demo' },
    { name: 'Nalini Swaminathan', dept: 'SCHOOL_EDU', desig: 'District Education Inspector', cap: 16, email: 'nalini.edu@pravah.demo' },
    { name: 'Manoj Hegde', dept: 'PUBLIC_TRANS', desig: 'Transport Operations Manager', cap: 20, email: 'manoj.transit@pravah.demo' },
    { name: 'Geeta Agarwal', dept: 'SOCIAL_WELFARE', desig: 'Welfare Project Officer', cap: 18, email: 'geeta.welfare@pravah.demo' },
    { name: 'Harish Choudhary', dept: 'CIVIC_INFRA', desig: 'Chief Civil Surveyor', cap: 15, email: 'harish.infra@pravah.demo' },
    { name: 'Tanvi Saxena', dept: 'PROPERTY_TAX', desig: 'Assessment Officer', cap: 25, email: 'tanvi.tax@pravah.demo' },
    { name: 'Naveen Reddy', dept: 'FIRE_RESCUE', desig: 'Divisional Fire Safety Inspector', cap: 14, email: 'naveen.fire@pravah.demo' },
    { name: 'Suresh Babu', dept: 'SANITATION', desig: 'Public Health Supervisor', cap: 22, email: 'suresh.sanitation@pravah.demo' },
  ];

  const officers: Record<string, any> = {};
  for (const off of officerNames) {
    let user = seededUsers[off.email];
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: off.name,
          email: off.email,
          passwordHash: DEMO_PASSWORD_HASH,
          role: 'OFFICER',
          phone: '+91 91234 56789',
          departmentId: depts[off.dept].id,
        },
      });
    }

    const createdOfficer = await prisma.officer.create({
      data: {
        userId: user.id,
        departmentId: depts[off.dept].id,
        designation: off.desig,
        workloadCapacity: off.cap,
      },
    });
    officers[off.name] = createdOfficer;
  }
  console.log(`✅ Seeded ${Object.keys(officers).length} officers`);

  // 5. SEED LOCATIONS (Realistic Geographic Hotspots in Urban Centers)
  const locationsData = [
    { address: 'Central Bus Terminal, MG Road Junction', latitude: 12.9716, longitude: 77.5946, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 112 (Shantala Nagar)' },
    { address: 'Shivaji Circle, Near Metro Pillar 142', latitude: 12.9750, longitude: 77.6050, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 112 (Shantala Nagar)' },
    { address: 'Main Bazaar Road, Near Civil Hospital Gate', latitude: 12.9850, longitude: 77.5850, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 94 (Gandhinagar)' },
    { address: 'Indiranagar 100ft Road, 12th Main', latitude: 12.9698, longitude: 77.6413, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 80 (Hoysala Nagar)' },
    { address: 'Koramangala 4th Block, 80 Feet Peripheral', latitude: 12.9345, longitude: 77.6265, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 151 (Koramangala)' },
    { address: 'Whitefield Main Road, Outer Ring Connector', latitude: 12.9698, longitude: 77.7499, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 84 (Hagadur)' },
    { address: 'Rajajinagar 1st Block, Near ESI Hospital', latitude: 12.9982, longitude: 77.5530, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 10 (Rajajinagar)' },
    { address: 'Jayanagar 4th Block Complex, 11th Main', latitude: 12.9299, longitude: 77.5826, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 153 (Jayanagar)' },
    { address: 'HSR Layout Sector 2, 27th Main Junction', latitude: 12.9116, longitude: 77.6389, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 174 (HSR Layout)' },
    { address: 'Hebbal Flyover Service Lane, Bellary Road', latitude: 13.0358, longitude: 77.5970, state: 'Karnataka', district: 'Bengaluru Urban', municipality: 'BBMP', ward: 'Ward 7 (Hebbal)' },
    { address: 'Bandra-Kurla Complex North Avenue', latitude: 19.0664, longitude: 72.8687, state: 'Maharashtra', district: 'Mumbai Suburban', municipality: 'MCGM', ward: 'Ward H/East' },
    { address: 'Connaught Place Outer Circle, Block C', latitude: 28.6315, longitude: 77.2167, state: 'Delhi', district: 'New Delhi', municipality: 'NDMC', ward: 'Ward 01 (Central)' },
  ];

  const seededLocations: any[] = [];
  for (const loc of locationsData) {
    const l = await prisma.location.create({ data: loc });
    seededLocations.push(l);
  }
  console.log(`✅ Seeded ${seededLocations.length} geographic locations`);

  // 6. SEED SHOWCASE COMPLAINT (PRD KEY DEMO SCENARIO - Section 49)
  // "Complaint: Large potholes and water accumulation near the main bus stand."
  // 84% SLA Risk, 3 transfers, 18 days inactive, Roads -> Municipal -> Revenue -> Roads deadlock!
  const showcaseGrievance = await prisma.grievance.create({
    data: {
      grievanceNumber: 'GRV-2026-0001',
      title: 'Severe road crater and continuous stormwater accumulation near Central Bus Terminal',
      description: 'The primary arterial asphalt near the Central Bus Terminal entrance has collapsed into deep 1.5-foot craters with exposed rebar. During moderate showers, water pools up to 2 feet deep, stalling public transport and triggering major traffic jams. Citizens and school buses have been forced to navigate the broken lane, causing multiple two-wheeler accidents.',
      category: 'Road Infrastructure',
      subCategory: 'Pothole & Surface Subsidence',
      departmentId: depts['ROADS_HWY'].id,
      assignedOfficerId: officers['Vikram Malhotra'].id,
      locationId: seededLocations[0].id,
      priority: 'CRITICAL',
      status: 'TRANSFERRED',
      severity: 'HIGH',
      citizenName: 'Priya Sharma',
      citizenPhone: '+91 98765 43210',
      citizenEmail: 'citizen@pravah.demo',
      createdAt: new Date(Date.now() - 24 * 86400000), // 24 days ago
      updatedAt: new Date(Date.now() - 18 * 86400000), // Stalled 18 days!
      slaDeadline: new Date(Date.now() - 12 * 86400000), // Breached SLA 12 days ago!
    },
  });

  // Status history for showcase
  await prisma.grievanceStatusHistory.createMany({
    data: [
      { grievanceId: showcaseGrievance.id, status: 'SUBMITTED', remarks: 'Citizen submitted grievance with geotagged photo evidence', changedBy: 'Priya Sharma (Citizen)', createdAt: new Date(Date.now() - 24 * 86400000) },
      { grievanceId: showcaseGrievance.id, status: 'IN_PROGRESS', remarks: 'Assigned to Roads & Highways Division. Site inspection ordered.', changedBy: 'Vikram Malhotra', createdAt: new Date(Date.now() - 22 * 86400000) },
      { grievanceId: showcaseGrievance.id, status: 'TRANSFERRED', remarks: 'Transferred to Municipal Admin: Drainage block claimed under corporation jurisdiction', changedBy: 'Vikram Malhotra', createdAt: new Date(Date.now() - 21 * 86400000) },
      { grievanceId: showcaseGrievance.id, status: 'TRANSFERRED', remarks: 'Transferred to Revenue: Encroachment dispute on road right-of-way boundary', changedBy: 'Amitabh Bhattacharya', createdAt: new Date(Date.now() - 20 * 86400000) },
      { grievanceId: showcaseGrievance.id, status: 'TRANSFERRED', remarks: 'Returned to Roads & Highways: Revenue confirmed road ownership belongs to PWD/State Highway', changedBy: 'Sneha Kulkarni', createdAt: new Date(Date.now() - 18 * 86400000) },
    ],
  });

  // Transfers establishing circular ping-pong
  await prisma.transfer.createMany({
    data: [
      { grievanceId: showcaseGrievance.id, fromDepartmentId: depts['ROADS_HWY'].id, toDepartmentId: depts['MUNICIPAL_ADMIN'].id, fromOfficerId: officers['Vikram Malhotra'].id, toOfficerId: officers['Amitabh Bhattacharya'].id, reason: 'Stormwater overflow claimed under municipal drainage division purview', transferredAt: new Date(Date.now() - 21 * 86400000) },
      { grievanceId: showcaseGrievance.id, fromDepartmentId: depts['MUNICIPAL_ADMIN'].id, toDepartmentId: depts['REVENUE_LAND'].id, fromOfficerId: officers['Amitabh Bhattacharya'].id, toOfficerId: officers['Sneha Kulkarni'].id, reason: 'Right-of-way boundary dispute; requesting land survey map', transferredAt: new Date(Date.now() - 20 * 86400000) },
      { grievanceId: showcaseGrievance.id, fromDepartmentId: depts['REVENUE_LAND'].id, toDepartmentId: depts['ROADS_HWY'].id, fromOfficerId: officers['Sneha Kulkarni'].id, toOfficerId: officers['Vikram Malhotra'].id, reason: 'Survey shows road is gazetted PWD corridor; maintenance rests with Roads Dept', transferredAt: new Date(Date.now() - 18 * 86400000) },
    ],
  });

  // Showcase Media & AI Visual Assessment
  const showcaseMedia1 = await prisma.media.create({
    data: {
      grievanceId: showcaseGrievance.id,
      fileUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1000&auto=format&fit=crop',
      mediaType: 'image',
      capturedAt: new Date(Date.now() - 24 * 86400000),
      latitude: 12.9716,
      longitude: 77.5946,
      uploadedBy: 'Priya Sharma',
    },
  });

  await prisma.mediaAnalysis.create({
    data: {
      mediaId: showcaseMedia1.id,
      detectedObjects: JSON.stringify(['Damaged asphalt', 'Surface depression', 'Standing water', 'Exposed gravel aggregate']),
      severity: 'HIGH',
      description: 'Severe structural road surface deterioration with chronic water ponding. Pothole depth estimated >35cm with visible base aggregate loss.',
      confidence: 0.91,
      model: 'pravah-vision-v1 (YOLO-v8 + ResNet50)',
      analyzedAt: new Date(Date.now() - 24 * 86400000),
    },
  });

  // Additional follow-up media establishing Visual Evidence Timeline (Day 1 -> Day 10 -> Day 20)
  const showcaseMedia2 = await prisma.media.create({
    data: {
      grievanceId: showcaseGrievance.id,
      fileUrl: 'https://images.unsplash.com/photo-1584463699039-383e74d15663?q=80&w=1000&auto=format&fit=crop',
      mediaType: 'image',
      capturedAt: new Date(Date.now() - 14 * 86400000),
      latitude: 12.9718,
      longitude: 77.5947,
      uploadedBy: 'Priya Sharma',
    },
  });

  await prisma.mediaAnalysis.create({
    data: {
      mediaId: showcaseMedia2.id,
      detectedObjects: JSON.stringify(['Water accumulation', 'Mud siltation', 'Impassable vehicle track']),
      severity: 'HIGH',
      description: 'Persistent water ponding after 10 days of non-intervention. Mud slurry formation spreading across adjacent walkway.',
      confidence: 0.88,
      model: 'pravah-vision-v1',
      analyzedAt: new Date(Date.now() - 14 * 86400000),
    },
  });

  // Showcase Risk Prediction: 84% SLA Risk Score
  await prisma.riskPrediction.create({
    data: {
      grievanceId: showcaseGrievance.id,
      riskScore: 84,
      riskLevel: 'CRITICAL',
      model: 'pravah-lightgbm-risk-v2',
      predictedAt: new Date(Date.now() - 18 * 86400000),
    },
  });

  // SHAP Explanations (TreeSHAP Feature Contributors)
  await prisma.riskExplanation.createMany({
    data: [
      { grievanceId: showcaseGrievance.id, feature: 'Reassignment / Transfer Count (3 transfers)', contribution: 21.0, rank: 1 },
      { grievanceId: showcaseGrievance.id, feature: 'Inactivity Duration (18 days stalled)', contribution: 19.0, rank: 2 },
      { grievanceId: showcaseGrievance.id, feature: 'Assigned Officer Workload Ratio (126% capacity)', contribution: 16.0, rank: 3 },
      { grievanceId: showcaseGrievance.id, feature: 'Department Backlog Saturation (Roads Dept: 210 pending)', contribution: 13.0, rank: 4 },
      { grievanceId: showcaseGrievance.id, feature: 'Category Historical Turnaround Lag (+14 days avg)', contribution: 8.0, rank: 5 },
      { grievanceId: showcaseGrievance.id, feature: 'Geographic High-Density Cluster Factor', contribution: 7.0, rank: 6 },
    ],
  });

  // Deadlock Detection Record
  await prisma.deadlockDetection.create({
    data: {
      grievanceId: showcaseGrievance.id,
      detected: true,
      cyclePath: JSON.stringify(['Roads & Highways', 'Municipal Administration', 'Revenue & Land Administration', 'Roads & Highways']),
      departmentsInvolved: JSON.stringify([depts['ROADS_HWY'].id, depts['MUNICIPAL_ADMIN'].id, depts['REVENUE_LAND'].id]),
      severity: 'HIGH',
      detectedAt: new Date(Date.now() - 18 * 86400000),
    },
  });

  // AI Recommendation for Showcase
  await prisma.recommendation.create({
    data: {
      grievanceId: showcaseGrievance.id,
      type: 'ESCALATE',
      recommendation: 'Escalate grievance to Nodal Officer (Dr. Sunita Rao, IAS) for multi-agency joint resolution',
      reason: '84% SLA breach probability with 3 circular transfers detected (Roads -> Municipal -> Revenue -> Roads). Case has been inactive for 18 days despite critical public transit disruption.',
      confidence: 0.89,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 18 * 86400000),
    },
  });

  // Semantic Embedding for Showcase
  await prisma.embedding.create({
    data: {
      grievanceId: showcaseGrievance.id,
      vector: JSON.stringify(Array.from({ length: 64 }, (_, i) => Math.sin(i * 0.15) * 0.5)),
      model: 'all-MiniLM-L6-v2',
    },
  });

  console.log('✅ Seeded key showcase demonstration complaint (GRV-2026-0001)');

  // 7. SEED 100+ REALISTIC GRIEVANCES ACROSS CATEGORIES
  const sampleScenarios = [
    {
      title: 'Broken stormwater drain grate causing vehicle hazard',
      desc: 'Heavy cast-iron drain cover collapsed into stormwater trench. Two cars damaged during night hours.',
      dept: 'DRAINAGE',
      cat: 'Stormwater & Drainage',
      priority: 'HIGH',
      severity: 'HIGH',
      risk: 76,
      daysAgo: 16,
      stalled: 12,
      status: 'IN_PROGRESS',
      locIdx: 1,
    },
    {
      title: 'Uncollected garbage mound accumulating outside Ward 112 school',
      desc: 'Municipal bin overflowed 5 days ago. Stray cattle and flies swarming entrance gate of Government Primary School.',
      dept: 'SOLID_WASTE',
      cat: 'Solid Waste Management',
      priority: 'CRITICAL',
      severity: 'HIGH',
      risk: 81,
      daysAgo: 9,
      stalled: 7,
      status: 'UNDER_REVIEW',
      locIdx: 0,
    },
    {
      title: 'High-voltage distribution transformer sparking intermittently',
      desc: 'Pole-mounted transformer at Shivaji Circle emits loud sparking sounds and smoke during evening peak load.',
      dept: 'ELECTRICITY',
      cat: 'Power Infrastructure',
      priority: 'CRITICAL',
      severity: 'SEVERE',
      risk: 92,
      daysAgo: 4,
      stalled: 2,
      status: 'IN_PROGRESS',
      locIdx: 1,
    },
    {
      title: 'Contaminated tap water with pungent chemical odor and turbid color',
      desc: 'Pipe supply in Indiranagar 12th Main delivers brownish water with visible suspended particles. Residents cannot use for cooking.',
      dept: 'WATER_SUPPLY',
      cat: 'Water Quality',
      priority: 'HIGH',
      severity: 'HIGH',
      risk: 79,
      daysAgo: 11,
      stalled: 8,
      status: 'TRANSFERRED',
      locIdx: 3,
    },
    {
      title: 'Missing streetlights on Koramangala 80 Feet Road (6 poles dark)',
      desc: 'Street lamps not operational for over two weeks from Sony Signal to 4th Block corner, making pedestrian crossing unsafe.',
      dept: 'STREET_LIGHT',
      cat: 'Illumination & Street Lighting',
      priority: 'MEDIUM',
      severity: 'MEDIUM',
      risk: 62,
      daysAgo: 19,
      stalled: 14,
      status: 'IN_PROGRESS',
      locIdx: 4,
    },
    {
      title: 'Delayed land mutation and property title certificate',
      desc: 'Citizen applied for khata transfer 75 days ago. Office keeps citing software migration without issuing acknowledgment.',
      dept: 'REVENUE_LAND',
      cat: 'Land Records & Titling',
      priority: 'MEDIUM',
      severity: 'LOW',
      risk: 88,
      daysAgo: 75,
      stalled: 40,
      status: 'TRANSFERRED',
      locIdx: 6,
    },
    {
      title: 'Defunct traffic signal triggering severe rush-hour gridlock',
      desc: 'Traffic light at Whitefield Outer Ring connector blinking amber permanently. Severe congestion for ambulances.',
      dept: 'TRAFFIC_MGMT',
      cat: 'Traffic Control',
      priority: 'HIGH',
      severity: 'HIGH',
      risk: 69,
      daysAgo: 8,
      stalled: 5,
      status: 'IN_PROGRESS',
      locIdx: 5,
    },
    {
      title: 'Lack of emergency oxygen flow meter in Ward Hospital Ward 4',
      desc: 'Secondary civil hospital lacks calibrated flow regulator for pediatric observation room.',
      dept: 'HEALTH_MED',
      cat: 'Public Healthcare Facilities',
      priority: 'CRITICAL',
      severity: 'SEVERE',
      risk: 86,
      daysAgo: 6,
      stalled: 4,
      status: 'UNDER_REVIEW',
      locIdx: 2,
    },
    {
      title: 'Illegal industrial effluent discharge into neighborhood culvert',
      desc: 'Chemical runoff with blue foam released into open municipal nullah near Rajajinagar Industrial Area.',
      dept: 'POLLUTION_CTRL',
      cat: 'Environmental Pollution',
      priority: 'HIGH',
      severity: 'HIGH',
      risk: 83,
      daysAgo: 14,
      stalled: 10,
      status: 'TRANSFERRED',
      locIdx: 6,
    },
    {
      title: 'Bus shelter roof collapsed during monsoon storm',
      desc: 'Public bus stop shelter at Hebbal junction collapsed. Passengers forced to stand in torrential rain.',
      dept: 'PUBLIC_TRANS',
      cat: 'Public Transit Infrastructure',
      priority: 'MEDIUM',
      severity: 'MEDIUM',
      risk: 54,
      daysAgo: 22,
      stalled: 15,
      status: 'IN_PROGRESS',
      locIdx: 9,
    },
  ];

  // Generate 105 grievances
  const totalToGenerate = 105;
  const officerList = Object.values(officers);

  for (let i = 2; i <= totalToGenerate; i++) {
    const scenario = sampleScenarios[(i - 2) % sampleScenarios.length];
    const loc = seededLocations[i % seededLocations.length];
    const dept = depts[scenario.dept];
    const officer = officerList[i % officerList.length];
    const daysAgo = scenario.daysAgo + (i % 7);
    const risk = Math.min(96, Math.max(25, scenario.risk + ((i * 13) % 25) - 10));
    const isHighRisk = risk >= 75;
    const isSlaBreached = daysAgo > 10;
    const isDeadlocked = i % 7 === 0;

    const grvNumber = `GRV-2026-${String(i).padStart(4, '0')}`;
    const status = isDeadlocked ? 'TRANSFERRED' : (i % 5 === 0 ? 'RESOLVED' : (i % 3 === 0 ? 'IN_PROGRESS' : 'UNDER_REVIEW'));

    const createdGrv = await prisma.grievance.create({
      data: {
        grievanceNumber: grvNumber,
        title: `${scenario.title} (#${i})`,
        description: `${scenario.desc} Location reference: ${loc.address}. Immediate citizen grievance filing.`,
        category: scenario.cat,
        subCategory: 'Civic Complaint',
        departmentId: dept.id,
        assignedOfficerId: officer.id,
        locationId: loc.id,
        priority: isHighRisk ? 'CRITICAL' : scenario.priority,
        status: status,
        severity: scenario.severity,
        citizenName: `Citizen ${i}`,
        citizenPhone: `+91 987${(10000 + i).toString().padStart(6, '0')}`,
        citizenEmail: `citizen${i}@sample.demo`,
        createdAt: new Date(Date.now() - daysAgo * 86400000),
        updatedAt: new Date(Date.now() - scenario.stalled * 86400000),
        resolvedAt: status === 'RESOLVED' ? new Date(Date.now() - 2 * 86400000) : null,
        slaDeadline: new Date(Date.now() - (daysAgo - 4) * 86400000),
      },
    });

    // History
    await prisma.grievanceStatusHistory.create({
      data: {
        grievanceId: createdGrv.id,
        status: createdGrv.status,
        remarks: `Complaint registered in automated portal. Initial classification by PRAVAH NLP engine.`,
        changedBy: 'System Auto-Router',
        createdAt: createdGrv.createdAt,
      },
    });

    // Risk Prediction
    await prisma.riskPrediction.create({
      data: {
        grievanceId: createdGrv.id,
        riskScore: risk,
        riskLevel: risk >= 80 ? 'CRITICAL' : (risk >= 65 ? 'HIGH' : (risk >= 45 ? 'MEDIUM' : 'LOW')),
        model: 'pravah-lightgbm-risk-v2',
        predictedAt: new Date(Date.now() - 3 * 86400000),
      },
    });

    // Risk Explanation
    await prisma.riskExplanation.createMany({
      data: [
        { grievanceId: createdGrv.id, feature: 'Historical Department Turnaround', contribution: 18.5, rank: 1 },
        { grievanceId: createdGrv.id, feature: 'Assigned Officer Current Workload', contribution: 14.2, rank: 2 },
        { grievanceId: createdGrv.id, feature: 'Complaint Category Complexity', contribution: 9.8, rank: 3 },
      ],
    });

    // Deadlock detection on selected cases
    if (isDeadlocked) {
      const pingDept1 = depts['CIVIC_INFRA'].name;
      const pingDept2 = depts['MUNICIPAL_ADMIN'].name;
      await prisma.deadlockDetection.create({
        data: {
          grievanceId: createdGrv.id,
          detected: true,
          cyclePath: JSON.stringify([pingDept1, pingDept2, pingDept1]),
          departmentsInvolved: JSON.stringify([depts['CIVIC_INFRA'].id, depts['MUNICIPAL_ADMIN'].id]),
          severity: 'HIGH',
          detectedAt: new Date(Date.now() - 5 * 86400000),
        },
      });

      // Also create transfers for this deadlock
      await prisma.transfer.createMany({
        data: [
          { grievanceId: createdGrv.id, fromDepartmentId: depts['CIVIC_INFRA'].id, toDepartmentId: depts['MUNICIPAL_ADMIN'].id, reason: 'Demarcation of maintenance zone unclear', transferredAt: new Date(Date.now() - 8 * 86400000) },
          { grievanceId: createdGrv.id, fromDepartmentId: depts['MUNICIPAL_ADMIN'].id, toDepartmentId: depts['CIVIC_INFRA'].id, reason: 'Corporation bylaws state infrastructure agency responsibility', transferredAt: new Date(Date.now() - 5 * 86400000) },
        ],
      });

      // Recommendation
      await prisma.recommendation.create({
        data: {
          grievanceId: createdGrv.id,
          type: 'REROUTE',
          recommendation: `Intervene in jurisdictional loop between ${pingDept1} and ${pingDept2}`,
          reason: 'Tarjan SCC detected 2-node circular transfer cycle causing 14+ days stall.',
          confidence: 0.92,
          status: 'PENDING',
        },
      });
    }

    // Media on some cases
    if (i % 2 === 0) {
      const media = await prisma.media.create({
        data: {
          grievanceId: createdGrv.id,
          fileUrl: i % 4 === 0 
            ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600&auto=format&fit=crop',
          mediaType: 'image',
          capturedAt: createdGrv.createdAt,
          latitude: loc.latitude + (Math.random() - 0.5) * 0.01,
          longitude: loc.longitude + (Math.random() - 0.5) * 0.01,
          uploadedBy: createdGrv.citizenName,
        },
      });

      await prisma.mediaAnalysis.create({
        data: {
          mediaId: media.id,
          detectedObjects: JSON.stringify(['Surface defect', 'Obstruction', 'Public hazard']),
          severity: isHighRisk ? 'HIGH' : 'MEDIUM',
          description: `AI-assisted visual assessment detected visible signs of ${scenario.cat} failure.`,
          confidence: 0.85,
          model: 'pravah-vision-v1',
        },
      });
    }

    // Semantic embeddings for similarity clusters
    await prisma.embedding.create({
      data: {
        grievanceId: createdGrv.id,
        vector: JSON.stringify(Array.from({ length: 64 }, (_, idx) => Math.cos((i + idx) * 0.2) * 0.4)),
        model: 'all-MiniLM-L6-v2',
        clusterId: `cluster-${(i % 5) + 1}`,
      },
    });
  }

  console.log(`✅ Seeded ${totalToGenerate} complete grievances with AI risk & routing data`);

  // 8. SEED SEMANTIC CLUSTERS (PRD Section 16 & Section 48)
  const clustersData = [
    { name: 'Road Surface Cratering & Potholes — Ward 112', description: 'Chronic asphalt degradation along Central Bus Terminal & Shivaji Circle corridor.', category: 'Road Infrastructure', complaintCount: 47 },
    { name: 'Water Distribution Pressure & Chemical Odor — Indiranagar', description: 'Multiple residential pipelines reporting turbid supply and low head pressure.', category: 'Water Supply', complaintCount: 38 },
    { name: 'Uncollected Municipal Solid Waste — Ward 94 Gandhinagar', description: 'Community garbage receptacles overflowing across school corridors and market squares.', category: 'Solid Waste Management', complaintCount: 29 },
    { name: 'Transformer Overheating & Arc Sparking — HSR Sector 2', description: 'Secondary distribution lines experiencing power spikes and audible corona discharge.', category: 'Electricity Distribution', complaintCount: 22 },
    { name: 'Stormwater Culvert Blockage & Monsoon Backflow — Koramangala', description: 'Debris-choked drains leading to standing water on 80 Feet Road.', category: 'Drainage & Stormwater', complaintCount: 34 },
  ];

  for (const c of clustersData) {
    await prisma.semanticCluster.create({ data: c });
  }

  // 9. SEED ROOT CAUSE ANALYTICS (PRD Section 21)
  await prisma.rootCause.createMany({
    data: [
      {
        title: 'Aging Underground Stormwater Culvert Collapse (Ward 112)',
        description: 'Detected Pattern: 47 repeated road crater and drainage overflow complaints concentrated along Central Bus Terminal corridor routed back and forth between Roads Dept and Municipal Corp. Potential Root Cause: 30-year-old pre-cast stormwater culvert has sustained internal subsidence, undermining road sub-base asphalt after each rainfall event.',
        departmentId: depts['ROADS_HWY'].id,
        locationId: seededLocations[0].id,
        evidenceCount: 47,
        confidence: 0.94,
        status: 'IDENTIFIED',
      },
      {
        title: 'Sub-station Feeder Overload at Peak Evening Hours (HSR Sector 2)',
        description: 'Detected Pattern: 22 recurring transformer sparking and brownout reports logged between 18:00 and 22:00. Potential Root Cause: Rapid commercial growth has exceeded feeder rated capacity by 34%, requiring installation of an auxiliary 250kVA step-down transformer.',
        departmentId: depts['ELECTRICITY'].id,
        locationId: seededLocations[8].id,
        evidenceCount: 22,
        confidence: 0.89,
        status: 'INVESTIGATING',
      },
      {
        title: 'Secondary Water Distribution Line Cross-Contamination (Indiranagar)',
        description: 'Detected Pattern: 38 potable water odor and contamination complaints across 3 adjacent streets. Potential Root Cause: Sub-surface fracture near old sewage manhole causing negative pressure siphonage during non-supply intervals.',
        departmentId: depts['WATER_SUPPLY'].id,
        locationId: seededLocations[3].id,
        evidenceCount: 38,
        confidence: 0.91,
        status: 'IDENTIFIED',
      },
    ],
  });

  // 10. SEED NOTIFICATIONS
  const citizenUser = seededUsers['citizen@pravah.demo'];
  const officerUser = seededUsers['officer@pravah.demo'];
  const nodalUser = seededUsers['nodal@pravah.demo'];

  await prisma.notification.createMany({
    data: [
      { userId: citizenUser.id, title: 'Grievance Registered', message: 'Your complaint GRV-2026-0001 has been registered and assigned tracking ID.', type: 'INFO' },
      { userId: officerUser.id, title: 'Critical SLA Warning', message: 'Complaint GRV-2026-0001 is 12 days past target SLA deadline. Immediate action required.', type: 'SLA_BREACH' },
      { userId: nodalUser.id, title: 'Procedural Deadlock Alert', message: 'Potential jurisdictional cycle detected on GRV-2026-0001 (Roads -> Municipal -> Revenue -> Roads).', type: 'DEADLOCK' },
      { userId: nodalUser.id, title: 'AI Recommendation Awaiting Approval', message: 'AI Engine recommended Escalation to Nodal Officer for GRV-2026-0001 with 89% confidence.', type: 'RECOMMENDATION' },
    ],
  });

  // 11. SEED AUDIT LOGS
  await prisma.auditLog.createMany({
    data: [
      { userId: citizenUser.id, action: 'CREATE_GRIEVANCE', entityType: 'GRIEVANCE', entityId: showcaseGrievance.id, metadata: JSON.stringify({ trackingId: 'GRV-2026-0001', category: 'Road Infrastructure' }) },
      { userId: officerUser.id, action: 'STATUS_UPDATE', entityType: 'GRIEVANCE', entityId: showcaseGrievance.id, metadata: JSON.stringify({ status: 'IN_PROGRESS', remarks: 'Site inspection dispatched' }) },
      { userId: officerUser.id, action: 'TRANSFER', entityType: 'GRIEVANCE', entityId: showcaseGrievance.id, metadata: JSON.stringify({ fromDept: 'ROADS_HWY', toDept: 'MUNICIPAL_ADMIN', reason: 'Drainage blockage' }) },
    ],
  });

  console.log('✨ PRAVAH-AI Database Seeding Successfully Completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
