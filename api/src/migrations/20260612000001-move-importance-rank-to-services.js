'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Remove from appointments (cleaning up the previous step)
    await queryInterface.removeColumn('appointments', 'importance_rank');
    
    // Add to services with the new name
    await queryInterface.addColumn('services', 'listing_rank', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('appointments', 'importance_rank', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    await queryInterface.removeColumn('services', 'listing_rank');
  }
};