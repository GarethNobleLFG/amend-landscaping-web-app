const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const ws = require('ws');

let supabase = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false 
        },
        realtime: {
          transport: ws 
        }
      }
    );
  } 
  catch (error) {
    console.warn('[StorageService] Supabase initialization failed:', error.message);
  }
} 
else {
  console.log('[StorageService] No credentials found, using local storage fallback.');
}

const uploadToStorage = async (base64String) => {
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid base64 string');

  const contentType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const extension = contentType.split('/')[1];
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

  if (process.env.NODE_ENV !== 'production') {
    const uploadDir = path.join(__dirname, '../../public/uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const localPath = path.join(uploadDir, fileName);
    fs.writeFileSync(localPath, buffer);

    return `http://localhost:${process.env.PORT}/uploads/${fileName}`;
  }

  // PRODUCTION: Supabase Storage Logic
  const { error } = await supabase.storage
    .from('images')
    .upload(`uploads/${fileName}`, buffer, { contentType, upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(`uploads/${fileName}`);

  return publicUrl;
};

module.exports = { uploadToStorage };