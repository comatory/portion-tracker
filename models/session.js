'use strict'

module.exports = (sequelize, DataTypes) => {
  var Session = sequelize.define('Session', {
    value: DataTypes.STRING,
    allowNull: false,
  }, {})
  Session.associate = function(models) {
    // associations can be defined here
    Session.belongsTo(models.User)
  }
  return Session
}
