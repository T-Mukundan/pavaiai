import { createClient } from '@supabase/supabase-js';

export function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export const supabase = getSupabase();

/**
 * Uploads an image (Buffer, File, or base64 data URL) to Supabase Storage
 * Returns the public URL of the uploaded image.
 */
export async function uploadEvidenceToSupabase(
  imageData: string | Buffer,
  filename: string
): Promise<string> {
  const client = getSupabase();
  const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'grievance-evidence';

  if (!client) {
    console.warn('⚠️ Supabase credentials not configured. Using fallback URL.');
    if (typeof imageData === 'string' && imageData.startsWith('data:')) {
      return imageData;
    }
    return `https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop`;
  }

  try {
    let fileBody: Buffer | Blob;
    let contentType = 'image/jpeg';

    if (typeof imageData === 'string') {
      if (imageData.startsWith('data:')) {
        const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          contentType = matches[1];
          fileBody = Buffer.from(matches[2], 'base64');
        } else {
          fileBody = Buffer.from(imageData);
        }
      } else {
        fileBody = Buffer.from(imageData);
      }
    } else {
      fileBody = imageData;
    }

    const uniquePath = `evidence/${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .upload(uniquePath, fileBody, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Retrieve public URL
    const { data: publicUrlData } = client.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uniquePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Failed to upload image to Supabase Storage:', err);
    // Graceful fallback to avoid breaking user submission
    return typeof imageData === 'string' && imageData.startsWith('data:')
      ? imageData
      : `https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop`;
  }
}
