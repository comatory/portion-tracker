'use strict'

const hat = require('hat')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'verified', Sequelize.BOOLEAN, {
      allowNull: false,
      defaultValue: 0,
    })
    await queryInterface.addColumn('Users', 'verificationCode', Sequelize.STRING, {
      allowNull: false,
      defaultValue: null,
    })

    return queryInterface.bulkUpdate('Users', { 'verified': true, 'verificationCode': hat() })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'verified')
    return queryInterface.removeColumn('Users', 'verificationCode')
  },
}
