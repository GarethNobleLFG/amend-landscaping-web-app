'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('appointments', 'approved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false // Automatically set to false when a new appointment is created
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('appointments', 'approved');
  }
};