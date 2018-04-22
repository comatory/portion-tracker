module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PortionHealthinesses', [
      {
        name: 'Healthy',
        value: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Normal',
        value: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Junk food',
        value: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PortionHealthinesses', {
      where: {
        [Sequelize.Op.or]: [{ name: 'Healthy' }, { name: 'Normal' }, { name: 'Junk food' }],
      },
    })
  },
}
