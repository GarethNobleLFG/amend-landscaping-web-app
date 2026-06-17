'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('appointments', 'referral_info', {
      type: Sequelize.STRING,
      allowNull: true, // Usually referral info is optional
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('appointments', 'referral_info');
  }
};