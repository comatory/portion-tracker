'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Portions', 'active', Sequelize.BOOLEAN, {
      allowNull: false,
      defaultValue: 1,
    })
    return queryInterface.bulkUpdate('Portions', { active: true })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Portions', 'active')
  },
}
