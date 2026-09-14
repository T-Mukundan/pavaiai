import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

async function runDiagnostic() {
  console.log('\n========================================================');
  console.log('    PRAVAH-AI DATABASE CONNECTIVITY DIAGNOSTIC');
  console.log('========================================================\n');

  // 1. Primary Prisma Database
  console.log('▶ [1/3] Testing Primary Relational Database (Prisma)...');
  const prismaUrl = process.env.DATABASE_URL || 'file:./dev.db';
  console.log(`   Configured URL: ${prismaUrl.startsWith('file:') ? 'SQLite Local (' + prismaUrl + ')' : prismaUrl.replace(/:[^:@]+@/, ':****@')}`);
  const prisma = new PrismaClient();
  const prismaStart = Date.now();
  try {
    const deptCount = await prisma.department.count();
    const grvCount = await prisma.grievance.count();
    const officerCount = await prisma.officer.count();
    const elapsed = Date.now() - prismaStart;
    console.log(`   ✅ Primary DB Connected successfully (${elapsed}ms)`);
    console.log(`      • Departments : ${deptCount}`);
    console.log(`      • Officers    : ${officerCount}`);
    console.log(`      • Grievances  : ${grvCount}`);
  } catch (err: any) {
    console.log(`   ❌ Primary DB Error: ${err.message}`);
  } finally {
    await prisma.$disconnect();
  }

  // 2. MongoDB
  console.log('\n▶ [2/3] Testing MongoDB Connection...');
  const mongoUri = process.env.MONGODB_URI || '';
  const mongoDbName = process.env.MONGODB_DB_NAME || 'pravah_ai';
  if (!mongoUri || !mongoUri.startsWith('mongodb')) {
    console.log('   ⚠️  MongoDB URI not configured or inactive.');
    console.log('      To connect MongoDB, set MONGODB_URI in web/.env:');
    console.log('      e.g. MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/pravah_ai"');
  } else {
    const sanitizedMongo = mongoUri.replace(/:[^:@]+@/, ':****@');
    console.log(`   Connecting to: ${sanitizedMongo}`);
    const mongoStart = Date.now();
    try {
      const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      const db = client.db(mongoDbName);
      await db.command({ ping: 1 });
      const elapsed = Date.now() - mongoStart;
      const collections = await db.listCollections().toArray();
      console.log(`   ✅ MongoDB Connected successfully (${elapsed}ms)`);
      console.log(`      • Database    : "${mongoDbName}"`);
      console.log(`      • Collections : ${collections.map(c => c.name).join(', ') || 'none yet (run npm run mongo:seed)'}`);
      await client.close();
    } catch (err: any) {
      console.log(`   ❌ MongoDB Connection Failed: ${err.message}`);
    }
  }

  // 3. Supabase Storage
  console.log('\n▶ [3/3] Testing Supabase Storage Connection...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'grievance-evidence';

  if (!supabaseUrl || !supabaseKey) {
    console.log('   ⚠️  Supabase credentials not configured in web/.env.');
    console.log('      To connect Supabase, set:');
    console.log('      NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"');
    console.log('      NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"');
  } else {
    console.log(`   Target Project URL: ${supabaseUrl}`);
    const supaStart = Date.now();
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: buckets, error } = await supabase.storage.listBuckets();
      const elapsed = Date.now() - supaStart;
      if (error) {
        console.log(`   ❌ Supabase Error: ${error.message}`);
      } else {
        console.log(`   ✅ Supabase Connected successfully (${elapsed}ms)`);
        console.log(`      • Available Buckets: ${buckets.map(b => b.name).join(', ') || 'none'}`);
        const foundBucket = buckets.find(b => b.name === bucketName);
        if (foundBucket) {
          console.log(`      • Target Bucket "${bucketName}": FOUND and ACTIVE (Public)`);
        } else {
          console.log(`      • Target Bucket "${bucketName}": Not found. Creating automatically...`);
          const { error: createErr } = await supabase.storage.createBucket(bucketName, { public: true });
          if (createErr) {
            console.log(`      ⚠️  Could not auto-create: ${createErr.message}. Please create bucket "${bucketName}" with Public=ON in your Supabase dashboard.`);
          } else {
            console.log(`      ✅ Target Bucket "${bucketName}" created successfully!`);
          }
        }
      }
    } catch (err: any) {
      console.log(`   ❌ Supabase Request Failed: ${err.message}`);
    }
  }

  console.log('\n========================================================\n');
}

runDiagnostic();
