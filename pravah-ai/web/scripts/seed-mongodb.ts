import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;
const dbName = process.env.MONGODB_DB_NAME || 'pravah_ai';

if (!uri || !uri.startsWith('mongodb')) {
  console.error('❌ MONGODB_URI is not configured in .env');
  console.log('👉 Please set MONGODB_URI="mongodb+srv://..." or "mongodb://localhost:27017/pravah_ai" in web/.env');
  process.exit(1);
}

async function seedMongoDB() {
  console.log(`🌱 Connecting to MongoDB: ${uri.split('@').pop()}...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`✅ Connected to MongoDB Database: "${dbName}"`);

    // Clean existing collections
    const collections = ['departments', 'officers', 'users', 'locations', 'grievances', 'transfers', 'media', 'risk_predictions', 'root_causes', 'audit_logs'];
    for (const col of collections) {
      await db.collection(col).deleteMany({});
    }
    console.log('🧹 Cleaned existing MongoDB collections.');

    // 1. Seed Departments
    const departmentsData = [
      { code: 'ROADS_HWY', name: 'Roads & Highways', category: 'Road Infrastructure', active: true },
      { code: 'DRAINAGE', name: 'Drainage & Stormwater', category: 'Drainage & Stormwater', active: true },
      { code: 'WATER_SUPPLY', name: 'Water Supply & Sewerage', category: 'Water Quality', active: true },
      { code: 'ELECTRICITY', name: 'Electricity Distribution', category: 'Power Infrastructure', active: true },
      { code: 'SOLID_WASTE', name: 'Solid Waste Management', category: 'Solid Waste Management', active: true },
      { code: 'STREET_LIGHT', name: 'Street Lighting', category: 'Illumination', active: true },
      { code: 'MUNICIPAL_ADMIN', name: 'Municipal Administration', category: 'Municipal Administration', active: true },
      { code: 'REVENUE_LAND', name: 'Revenue & Land Administration', category: 'Land Records', active: true },
      { code: 'HEALTH_MED', name: 'Health & Medical Services', category: 'Healthcare', active: true },
      { code: 'TRAFFIC_MGMT', name: 'Traffic Management', category: 'Traffic Control', active: true },
      { code: 'CIVIC_INFRA', name: 'Civic Infrastructure', category: 'Civil Works', active: true },
    ];
    await db.collection('departments').insertMany(departmentsData);
    console.log(`✅ Inserted ${departmentsData.length} Departments into MongoDB`);

    // 2. Seed Personas
    const usersData = [
      { name: 'Priya Sharma', email: 'citizen@pravah.demo', role: 'CITIZEN', phone: '+91 98765 43210' },
      { name: 'Vikram Malhotra', email: 'officer@pravah.demo', role: 'OFFICER', department: 'Roads & Highways' },
      { name: 'Dr. Sunita Rao, IAS', email: 'nodal@pravah.demo', role: 'NODAL_OFFICER', department: 'General Administration' },
      { name: 'Aditya Sen', email: 'analyst@pravah.demo', role: 'ANALYST', department: 'Civic Infrastructure' },
      { name: 'Super Admin Pravah', email: 'admin@pravah.demo', role: 'SUPER_ADMIN', department: 'Governance' },
    ];
    await db.collection('users').insertMany(usersData);
    console.log(`✅ Inserted 5 User Personas into MongoDB`);

    // 3. Seed Showcase Grievance (GRV-2026-0001)
    const showcaseGrievance = {
      grievanceNumber: 'GRV-2026-0001',
      title: 'Severe road crater and continuous stormwater accumulation near Central Bus Terminal',
      description: 'The primary arterial asphalt near the Central Bus Terminal entrance has collapsed into deep 1.5-foot craters with exposed rebar. Trapped in circular transfer deadlock.',
      category: 'Road Infrastructure',
      department: 'Roads & Highways',
      location: {
        address: 'Central Bus Terminal, MG Road Junction',
        ward: 'Ward 112 (Shantala Nagar)',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      priority: 'CRITICAL',
      status: 'TRANSFERRED',
      severity: 'HIGH',
      riskScore: 84,
      isDeadlocked: true,
      cyclePath: ['Roads & Highways', 'Municipal Administration', 'Revenue & Land Administration', 'Roads & Highways'],
      evidenceUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1200&auto=format&fit=crop',
      aiVisionAnalysis: {
        detectedObjects: ['Damaged asphalt', 'Surface depression', 'Standing water'],
        confidence: 0.91,
        severity: 'HIGH',
      },
      createdAt: new Date(Date.now() - 24 * 86400000),
      updatedAt: new Date(Date.now() - 18 * 86400000),
      slaDeadline: new Date(Date.now() - 12 * 86400000),
    };
    await db.collection('grievances').insertOne(showcaseGrievance);

    // 4. Seed Additional 50 Grievances
    const batchGrievances = [];
    for (let i = 2; i <= 50; i++) {
      const isRisk = i % 3 === 0;
      const grvId = `GRV-2026-${String(i).padStart(4, '0')}`;
      batchGrievances.push({
        grievanceNumber: grvId,
        title: `Civic Infrastructure Report #${i}`,
        description: `Operational report for public service delivery monitoring. Reference: Ward ${(i % 15) + 1}.`,
        category: i % 2 === 0 ? 'Road Infrastructure' : 'Water Supply',
        department: i % 2 === 0 ? 'Roads & Highways' : 'Water Supply & Sewerage',
        location: {
          ward: `Ward ${(i % 15) + 1}`,
          latitude: 12.9716 + (Math.random() - 0.5) * 0.05,
          longitude: 77.5946 + (Math.random() - 0.5) * 0.05,
        },
        priority: isRisk ? 'CRITICAL' : 'HIGH',
        status: i % 4 === 0 ? 'RESOLVED' : 'IN_PROGRESS',
        riskScore: isRisk ? 82 : 45,
        createdAt: new Date(Date.now() - (i % 15) * 86400000),
      });
    }
    await db.collection('grievances').insertMany(batchGrievances);
    console.log(`✅ Seeded 51 Grievance documents in MongoDB 'grievances' collection!`);

    console.log('\n✨ MONGODB SEEDING COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ MongoDB Seeding Error:', err);
  } finally {
    await client.close();
  }
}

seedMongoDB();
