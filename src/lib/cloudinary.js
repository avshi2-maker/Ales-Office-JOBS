// cloudinary.js (src/lib/cloudinary.js) · updated 22.09.2026 12:55 (Asia/Jerusalem)
// Unsigned browser upload to Cloudinary (image + video via /auto/upload).

const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryReady = Boolean(cloud && preset);

// Uploads one file, returns {url, type, public_id}. onProgress(0..100) optional.
export function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!cloudinaryReady) {
      reject(new Error("Cloudinary לא מוגדר (חסר .env.local)"));
      return;
    }
    const url = `https://api.cloudinary.com/v1_1/${cloud}/auto/upload`;
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);
    form.append("folder", "ales-jobs");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const r = JSON.parse(xhr.responseText);
        resolve({ url: r.secure_url, type: r.resource_type, public_id: r.public_id });
      } else {
        reject(new Error("העלאה נכשלה (" + xhr.status + ")"));
      }
    };
    xhr.onerror = () => reject(new Error("שגיאת רשת בהעלאה"));
    xhr.send(form);
  });
}
