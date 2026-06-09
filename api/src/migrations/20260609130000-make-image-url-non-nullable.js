'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Before applying the constraint, ensure no nulls exist (optional safety)
    // await queryInterface.sequelize.query('UPDATE image_registry SET image_url = "placeholder" WHERE image_url IS NULL');

    await queryInterface.changeColumn('image_registry', 'image_url', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('image_registry', 'image_url', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  }
};