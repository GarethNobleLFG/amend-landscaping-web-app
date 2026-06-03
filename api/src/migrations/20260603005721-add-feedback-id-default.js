'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE feedback
      ALTER COLUMN id
      SET DEFAULT gen_random_uuid();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE feedback
      ALTER COLUMN id
      DROP DEFAULT;
    `);
  }
};