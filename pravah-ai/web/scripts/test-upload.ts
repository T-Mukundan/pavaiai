import { uploadEvidenceToSupabase } from '../lib/supabase';
import * as dotenv from 'dotenv';

dotenv.config();

async function run() {
  console.log('Uploading test image probe to Supabase Storage...');
  const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  try {
    const url = await uploadEvidenceToSupabase(sampleBase64, 'probe_test.png');
    console.log('✅ UPLOAD SUCCESSFUL!');
    console.log('Public URL:', url);
  } catch (err: any) {
    console.error('❌ Upload failed:', err.message);
  }
}

run();
