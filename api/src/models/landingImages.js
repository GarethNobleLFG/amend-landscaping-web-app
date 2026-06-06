const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ImageRegistry = require('./imageRegistry');

const LandingImage = sequelize.define('LandingImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  image_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'image_registry',
      key: 'id'
    }
  },
}, {
  tableName: 'landing_images',
  timestamps: true,
});

LandingImage.belongsTo(ImageRegistry, { 
  foreignKey: 'image_id',
  as: 'image' 
});

module.exports = LandingImage;