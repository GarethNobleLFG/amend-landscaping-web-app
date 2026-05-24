const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('amend_landscaping', 'postgres', process.env.LOCAL_POSTGRES_PASSWORD, {
  host: 'db',
  dialect: 'postgres',
  logging: false, 
});

module.exports = sequelize;