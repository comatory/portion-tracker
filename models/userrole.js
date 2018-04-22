'use strict'
module.exports = (sequelize, DataTypes) => {
  var UserRole = sequelize.define('UserRole', {
    UserId: DataTypes.INTEGER,
    RoleId: DataTypes.INTEGER,
  }, {})
  UserRole.associate = function(models) {
    // associations can be defined here
    UserRole.belongsTo(models.Role)
    UserRole.belongsTo(models.User)
  }
  return UserRole
}
