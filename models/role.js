'use strict'
module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
  })
  Role.associate = function(models) {
    // associations can be defined here
    Role.belongsToMany(models.User, { through: 'UserRole' })
  }
  return Role
}
