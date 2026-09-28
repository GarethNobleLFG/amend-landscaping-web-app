const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} 
else {
  sequelize = new Sequelize('amend_landscaping', 'postgres', 'password', {
    host: 'db',
    dialect: 'postgres',
    logging: false,
  });
}

module.exports = sequelize;