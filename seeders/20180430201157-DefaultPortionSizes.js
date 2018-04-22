module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PortionSizes', [
      {
        name: 'Small',
        value: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Medium',
        value: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Large',
        value: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PortionSizes', {
      where: {
        [Sequelize.Op.or]: [{ name: 'Small' }, { name: 'Medium' }, { name: 'Large' }],
      },
    })
  },
}
