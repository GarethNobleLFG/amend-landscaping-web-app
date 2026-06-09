const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ImageRegistry = sequelize.define('ImageRegistry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'image_registry',
  timestamps: true, 
});

module.exports = ImageRegistry;