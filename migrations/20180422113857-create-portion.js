'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Portions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      note: {
        type: Sequelize.STRING,
      },
      calories: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      PortionHealthinessId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'PortionHealthinesses',
          key: 'id',
        },
      },
      PortionSizeId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'PortionSizes',
          key: 'id',
        },
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Portions')
  },
}
