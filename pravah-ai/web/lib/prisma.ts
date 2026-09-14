import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  // 1. If explicit URL is provided and not a relative SQLite file, use as is
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // 2. If running on Netlify/Vercel/AWS Lambda serverless, resolve path to dev.db or /tmp
  const isServerless = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL;

  if (isServerless) {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(tmpDbPath)) {
      // Find candidate locations for bundled dev.db
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'pravah-ai', 'web', 'prisma', 'dev.db'),
        path.join(__dirname, 'prisma', 'dev.db'),
        path.join(__dirname, '..', 'prisma', 'dev.db'),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          } catch (e) {
            console.warn('Could not copy dev.db to /tmp:', e);
          }
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return `file:${tmpDbPath}`;
    }
  }

  // 3. Local candidate search
  const localCandidates = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(process.cwd(), 'dev.db'),
    path.join(process.cwd(), 'pravah-ai', 'web', 'prisma', 'dev.db'),
  ];

  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      return `file:${candidate}`;
    }
  }

  return envUrl || 'file:./prisma/dev.db';
}

function createPrismaClient(): PrismaClient {
  try {
    const dbUrl = getDatabaseUrl();
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
      log: ['error'],
    });
  } catch (err) {
    console.error('Failed to initialize Prisma client, using resilient fallback:', err);
    return new Proxy({} as any, {
      get: (_target, _prop) => {
        return new Proxy({} as any, {
          get: () => async () => [],
        });
      },
    });
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
