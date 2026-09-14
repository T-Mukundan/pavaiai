import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isMongoConnected, getMongoDb } from '@/lib/mongodb';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    primaryDb: {
      type: 'Prisma (Relational)',
      status: 'DISCONNECTED',
      latencyMs: null,
      counts: null,
      error: null,
    },
    mongoDb: {
      type: 'MongoDB (NoSQL Document Store)',
      status: 'DISCONNECTED',
      latencyMs: null,
      error: null,
    },
    supabaseStorage: {
      type: 'Supabase Storage (Photographic Evidence)',
      status: 'DISCONNECTED',
      configured: false,
      error: null,
    },
  };

  // 1. Check Primary Prisma DB
  try {
    const t0 = Date.now();
    const [deptCount, grvCount, officerCount] = await Promise.all([
      prisma.department.count(),
      prisma.grievance.count(),
      prisma.officer.count(),
    ]);
    results.primaryDb = {
      type: 'Prisma (Relational)',
      status: 'CONNECTED',
      latencyMs: Date.now() - t0,
      counts: {
        departments: deptCount,
        grievances: grvCount,
        officers: officerCount,
      },
      error: null,
    };
  } catch (err: any) {
    results.primaryDb.error = err.message;
  }

  // 2. Check MongoDB
  try {
    const t0 = Date.now();
    const connected = await isMongoConnected();
    if (connected) {
      const db = await getMongoDb();
      const count = db ? await db.collection('grievances').countDocuments() : 0;
      results.mongoDb = {
        type: 'MongoDB (NoSQL Document Store)',
        status: 'CONNECTED',
        latencyMs: Date.now() - t0,
        grievanceCount: count,
        error: null,
      };
    } else {
      results.mongoDb.error = 'Unable to establish MongoDB connection. Check MONGODB_URI in web/.env.';
    }
  } catch (err: any) {
    results.mongoDb.error = err.message;
  }

  // 3. Check Supabase
  if (supabase) {
    results.supabaseStorage.configured = true;
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        results.supabaseStorage.error = error.message;
      } else {
        results.supabaseStorage.status = 'CONNECTED';
        results.supabaseStorage.buckets = data.map((b) => b.name);
      }
    } catch (err: any) {
      results.supabaseStorage.error = err.message;
    }
  } else {
    results.supabaseStorage.error = 'Supabase credentials not configured in web/.env.';
  }

  return NextResponse.json(results);
}
