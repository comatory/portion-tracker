const { Role, User } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const admin = await User.findById(1)
    const user = await User.findById(2)
    const adminRole = await Role.findById(1)
    const userRole = await Role.findById(2)

    return queryInterface.bulkInsert('UserRoles', [
      {
        RoleId: adminRole.id,
        UserId: admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        RoleId: userRole.id,
        UserId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserRoles', {
      where: {
        id: [ 1, 2 ],
      },
    })
  },
}
