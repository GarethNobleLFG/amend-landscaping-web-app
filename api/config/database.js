const { Sequelize } = require('sequelize');

// Replace with your actual PostgreSQL credentials
const sequelize = new Sequelize('amend_landscaping', 'postgres', process.env.LOCAL_POSTGRES_PASSWORD, {
  host: 'host.docker.internal',
  dialect: 'postgres',
  logging: false, 
});

module.exports = sequelize;