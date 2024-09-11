'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'role', { 
      type: Sequelize.STRING,
      allowNull: false 
    });
    /**
     * Add altering commands here.
     *
     * Example:
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'role');
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  }
};
