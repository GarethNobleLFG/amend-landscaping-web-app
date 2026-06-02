const landingImageRepo = require('../repositories/landingImageRepository');

const addLandingImage = async (imageId) => {
    const sanitizedId = imageId === '' ? null : imageId;
    return await landingImageRepo.create({ image_id: sanitizedId });
};

const getAllLandingImages = async () => {
    return await landingImageRepo.findAll();
};

const removeLandingImage = async (id) => {
    return await landingImageRepo.deleteImage(id);
};

module.exports = {
    addLandingImage,
    getAllLandingImages,
    removeLandingImage
};