import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || '';
const dbName = process.env.MONGODB_DB_NAME || 'pravah_ai';

const clientOptions = {
  serverSelectionTimeoutMS: 3000,
  connectTimeoutMS: 3000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri && uri.startsWith('mongodb')) {
  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, clientOptions);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, clientOptions);
    clientPromise = client.connect();
  }
}

export async function getMongoDb(): Promise<Db | null> {
  if (!clientPromise) {
    return null;
  }
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    return null;
  }
}

export async function isMongoConnected(): Promise<boolean> {
  if (!clientPromise) return false;
  try {
    const db = await getMongoDb();
    if (!db) return false;
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export default clientPromise;
