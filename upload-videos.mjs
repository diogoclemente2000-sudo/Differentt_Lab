import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET antes de executar este script.');
}

const photosDir = join(__dirname, 'Website_photos');

function getAllVideos(dir) {
  const files = [];
  for (const item of readdirSync(dir)) {
    const fullPath = join(dir, item);
    if (statSync(fullPath).isDirectory()) {
      files.push(...getAllVideos(fullPath));
    } else if (/\.(mp4|webm|mov)$/i.test(item)) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllVideos(photosDir);
console.log(`Found ${files.length} videos to upload...`);

let done = 0;
for (const file of files) {
  const relPath = relative(__dirname, file).replace(/\\/g, '/');
  const publicId = relPath.replace(/\.(mp4|webm|mov)$/i, '');
  try {
    await cloudinary.uploader.upload(file, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'video'
    });
    done++;
    console.log(`[${done}/${files.length}] ${publicId}`);
  } catch (e) {
    console.error(`FAILED: ${publicId} — ${e.message}`);
  }
}
console.log('Done!');
