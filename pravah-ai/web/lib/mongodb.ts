import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || 'pravah_ai';

// Fast fail options to prevent blocking web requests
const clientOptions = {
  serverSelectionTimeoutMS: 1500,
  connectTimeoutMS: 1500,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Circuit breaker state to avoid repeated timeout hangs
let isOffline = false;
let nextRetryAt = 0;

function canAttemptConnection(): boolean {
  if (!uri || !uri.startsWith('mongodb')) return false;
  if (isOffline && Date.now() < nextRetryAt) {
    return false;
  }
  return true;
}

if (uri && uri.startsWith('mongodb')) {
  try {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, clientOptions);
      globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
        isOffline = true;
        nextRetryAt = Date.now() + 60000; // Back off for 60 seconds
        console.warn('⚠️ MongoDB connection unavailable (Atlas SSL/network). Using relational SQLite primary:', err.message);
        throw err;
      });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } catch (err) {
    isOffline = true;
    nextRetryAt = Date.now() + 60000;
  }
}

export async function getMongoDb(): Promise<Db | null> {
  if (!canAttemptConnection() || !clientPromise) {
    return null;
  }
  try {
    const connectedClient = await clientPromise;
    isOffline = false;
    return connectedClient.db(dbName);
  } catch (err) {
    isOffline = true;
    nextRetryAt = Date.now() + 60000;
    return null;
  }
}

export async function isMongoConnected(): Promise<boolean> {
  if (!canAttemptConnection() || !clientPromise) return false;
  try {
    const db = await getMongoDb();
    if (!db) return false;
    await db.command({ ping: 1 });
    return true;
  } catch {
    isOffline = true;
    nextRetryAt = Date.now() + 60000;
    return false;
  }
}

/**
 * Non-blocking background sync for grievances
 */
export function backgroundSyncGrievance(data: any): void {
  if (!canAttemptConnection()) return;
  getMongoDb()
    .then((db) => {
      if (db) {
        db.collection('grievances').insertOne({
          ...data,
          syncedAt: new Date(),
        }).catch(() => {});
      }
    })
    .catch(() => {});
}

/**
 * Non-blocking background sync for users
 */
export function backgroundSyncUser(data: any): void {
  if (!canAttemptConnection()) return;
  getMongoDb()
    .then((db) => {
      if (db) {
        db.collection('users').insertOne({
          ...data,
          syncedAt: new Date(),
        }).catch(() => {});
      }
    })
    .catch(() => {});
}

export default clientPromise;
