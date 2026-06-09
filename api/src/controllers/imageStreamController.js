const imageStreamService = require('../services/imageStreamService');

const streamImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imageData = await imageStreamService.getImageRaw(id);

    if (!imageData || !imageData.buffer) {
      console.warn(`[ImageStreamController] Image not found or invalid: ${id}`);
      return res.status(404).end(); 
    }

    res.set({
      'Content-Type': imageData.contentType,
      'Content-Length': imageData.buffer.length,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*' 
    });

    return res.status(200).send(imageData.buffer);
  } 
  catch (error) {
    console.error(`[ImageStreamController] Fatal error streaming ${req.params.id}:`, error);
    return res.status(500).end();
  }
};

module.exports = {
  streamImage,
};