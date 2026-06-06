'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Testimony extends Model {}

Testimony.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quote: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Testimony',
  tableName: 'testimonies'
});

module.exports = Testimony;