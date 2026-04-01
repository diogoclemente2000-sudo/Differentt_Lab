import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

cloudinary.config({
  cloud_name: 'dgun4lhkm',
  api_key: '894592477567926',
  api_secret: '8ftKWDzo-b-0-LNGoHe48Q_tjSE'
});

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
