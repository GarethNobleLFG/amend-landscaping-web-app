'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('image_registry');

    // 1. Only try to remove image_data if it actually exists
    if (tableInfo.image_data) {
      await queryInterface.removeColumn('image_registry', 'image_data');
    }

    // 2. Only try to add image_url if it doesn't exist yet
    if (!tableInfo.image_url) {
      await queryInterface.addColumn('image_registry', 'image_url', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // 3. Clear existing dirty rows to be safe
    await queryInterface.bulkDelete('image_registry', null, { truncate: true, cascade: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('image_registry', 'image_data', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.removeColumn('image_registry', 'image_url');
  }
};