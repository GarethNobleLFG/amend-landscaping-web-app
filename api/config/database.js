const { Sequelize } = require('sequelize');

// Replace with your actual PostgreSQL credentials
const sequelize = new Sequelize('amend_landscaping', 'postgres', '45Rt!@', {
  host: 'host.docker.internal',
  dialect: 'postgres',
  logging: false, 
});

module.exports = sequelize;