const bcrypt = require('bcrypt')
const hat = require('hat')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hashSync('123123', 10)
    return queryInterface.bulkInsert('Users', [
      {
        id: 1,
        email: 'admin@portiontracker.dev',
        passwordDigest: password,
        createdAt: new Date(),
        updatedAt: new Date(),
        verified: false,
        verificationCode: hat(),
      },
      {
        id: 2,
        email: 'user@portiontracker.dev',
        passwordDigest: password,
        createdAt: new Date(),
        updatedAt: new Date(),
        verified: false,
        verificationCode: hat(),
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', {
      where: {
        email: [ 'admin@portiontracker.dev', 'user@portiontracker.dev' ],
      },
    })
  },
}
