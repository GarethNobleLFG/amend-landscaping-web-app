const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ImageRegistry = require('./imageRegistry');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  image_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'image_registry',
      key: 'id'
    }
  },
  listing_rank: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'services',
  timestamps: false,
});

Service.belongsTo(ImageRegistry, {
  foreignKey: 'image_id',
  as: 'image'
});

module.exports = Service;