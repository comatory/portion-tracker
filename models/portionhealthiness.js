'use strict'
module.exports = (sequelize, DataTypes) => {
  var PortionHealthiness = sequelize.define('PortionHealthiness', {
    value: DataTypes.INTEGER,
    name: DataTypes.STRING,
  }, {})
  PortionHealthiness.associate = function(models) {
    // associations can be defined here
  }
  return PortionHealthiness
}
