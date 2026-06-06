'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First add the column as nullable
    await queryInterface.addColumn('services', 'name', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    
    // Set existing rows' name equal to their description as a default
    await queryInterface.sequelize.query(
      `UPDATE services SET name = description WHERE name IS NULL`
    );
    
    // Now alter the column to be NOT NULL
    await queryInterface.changeColumn('services', 'name', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('services', 'name');
  },
};
