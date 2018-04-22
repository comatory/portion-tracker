'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ActivityPortions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      PortionId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Portions',
          key: 'id',
        },
      },
      ActivityId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'Activities',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ActivityPortions')
  },
}
