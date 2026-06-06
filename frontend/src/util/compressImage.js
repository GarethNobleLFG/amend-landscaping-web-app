import heic2any from "heic2any";

export const compressImage = async (file, maxWidth = 1200, quality = 0.7) => {
  if (!file) {
    throw new Error('No file provided');
  }

  let finalFile = file;

  const isHeic = 
    file.name?.toLowerCase().endsWith('.heic') || 
    file.name?.toLowerCase().endsWith('.heif') || 
    file.type === 'image/heic' || 
    file.type === 'image/heif';

  if (isHeic) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 1 
      });
      finalFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    } 
    catch (err) {
      console.error("HEIC conversion failed, attempting normal compression:", err);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(finalFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleSize = maxWidth / img.width;

        canvas.width = img.width > maxWidth ? maxWidth : img.width;
        canvas.height = img.width > maxWidth ? img.height * scaleSize : img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        try {
          const compressedBase64 = canvas.toDataURL('image/webp', quality);
          resolve(compressedBase64);
        } 
        catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(new Error('Image failed to load: ' + err.message));
    };
    reader.onerror = (err) => reject(new Error('File reading failed: ' + err.message));
  });
};