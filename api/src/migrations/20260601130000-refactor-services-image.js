'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add the image_id column (UUID) to link to the image_registry table
    await queryInterface.addColumn('services', 'image_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'image_registry',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // 2. Add an index for fast lookups on image_id
    await queryInterface.addIndex('services', ['image_id'], {
      name: 'services_image_id_idx'
    });

    // 3. Remove the old raw text image column
    await queryInterface.removeColumn('services', 'image');
  },

  async down(queryInterface, Sequelize) {
    // 1. Re-add the raw image column
    await queryInterface.addColumn('services', 'image', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // 2. Remove the index
    await queryInterface.removeIndex('services', 'services_image_id_idx');

    // 3. Remove the image_id link
    await queryInterface.removeColumn('services', 'image_id');
  }
};