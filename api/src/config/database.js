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
        rejectUnauthorized: false // Required for Supabase/Heroku/Render
      }
    }
  });
} 
else {
  // Local Docker development
  sequelize = new Sequelize('amend_landscaping', 'postgres', process.env.LOCAL_POSTGRES_PASSWORD, {
    host: 'db',
    dialect: 'postgres',
    logging: false,
  });
}

module.exports = sequelize;