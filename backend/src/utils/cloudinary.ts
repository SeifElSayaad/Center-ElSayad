import { v2 as cloudinary } from 'cloudinary';

// Note: Cloudinary will automatically pick up the CLOUDINARY_URL from process.env
// if it is set. Otherwise, you can explicitly configure it:
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a file buffer to Cloudinary and returns the secure URL.
 * Falls back to a placeholder URL if Cloudinary is not configured.
 */
export async function uploadImageBuffer(buffer: Buffer, folder: string = 'center-elsayad'): Promise<string> {
  // If no credentials, just return a fake placeholder to avoid crashing local dev
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('⚠️ Cloudinary is not configured. Returning placeholder image URL.');
    return 'https://via.placeholder.com/600x600?text=Mock+Image';
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Unknown Cloudinary upload error'));
        }
      }
    );

    uploadStream.end(buffer);
  });
}
