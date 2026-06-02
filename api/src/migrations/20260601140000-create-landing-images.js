'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('landing_images', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      image_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'image_registry',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add index for fast retrieval of the linked images
    await queryInterface.addIndex('landing_images', ['image_id'], {
      name: 'landing_images_image_id_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('landing_images');
  }
};