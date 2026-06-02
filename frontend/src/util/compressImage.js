export const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
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
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => reject(new Error('Image failed to load: ' + err.message));
    };
    reader.onerror = (err) => reject(new Error('File reading failed: ' + err.message));
  });
};