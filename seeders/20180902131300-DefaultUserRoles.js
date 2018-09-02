const { Role, User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const admin = await User.findOne({ id: 1 })
    const role = await Role.findOne({ name: 'admin' })

    return queryInterface.bulkInsert('UserRoles', [
      {
        id: 1,
        RoleId: role.id,
        UserId: admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserRoles', {
      where: {
        id: 1,
      },
    })
  },
}
