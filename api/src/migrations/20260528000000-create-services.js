'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('services');
  }
};