const imageRegistryRepo = require('../repositories/imageRegistryRepository');

const getImageRaw = async (id) => {
  const image = await imageRegistryRepo.findById(id);

  if (!image || !image.image_data) {
    console.error(`[ImageStreamService] No data found for image ID: ${id}`);
    return null;
  }

  let base64Data = image.image_data;
  let contentType = 'image/jpeg'; 

  if (base64Data.startsWith('data:')) {
    const metaParts = base64Data.split(',');
    if (metaParts.length > 1) {
      const mime = metaParts[0].match(/:(.*?);/);
      if (mime) {
        contentType = mime[1];
      }
      base64Data = metaParts[1];
    }
  }

  try {
    const buffer = Buffer.from(base64Data, 'base64');
    
    if (buffer.length === 0) {
      throw new Error("Resulting buffer is empty");
    }

    return { buffer, contentType };
  } 
  catch (err) {
    console.error(`[ImageStreamService] Buffer conversion failed for ${id}:`, err.message);
    return null;
  }
};

module.exports = {
  getImageRaw,
};