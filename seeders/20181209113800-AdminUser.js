require('dotenv').config()

const bcrypt = require('bcrypt')
const hat = require('hat')

const { Role, User } = require('../models')

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
      console.warn('DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD is missing in env variables')
      return
    }

    const adminRole = await Role.findOne({ name: 'admin' })
    const password = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10)

    await queryInterface.bulkInsert('Users', [
      {
        email: DEFAULT_ADMIN_EMAIL,
        passwordDigest: password,
        createdAt: new Date(),
        updatedAt: new Date(),
        verified: true,
        verificationCode: hat(),
      },
    ])

    const defaultAdminUser = await User.findOne({ email: DEFAULT_ADMIN_EMAIL })

    return queryInterface.bulkInsert('UserRoles', [
      {
        RoleId: adminRole.id,
        UserId: defaultAdminUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
      console.warn('DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD is missing in env variables')
      return
    }

    const adminRole = await Role.findOne({ name: 'admin' })

    await queryInterface.bulkDelete('User', {
      where: {
        email: [ DEFAULT_ADMIN_EMAIL ],
      },
    })

    return queryInterface.bulkDelete('UserRoles', {
      where: {
        id: [ adminRole.id ],
      },
    })
  },
}
