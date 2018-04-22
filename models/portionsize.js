'use strict'
module.exports = (sequelize, DataTypes) => {
  var PortionSize = sequelize.define('PortionSize', {
    value: DataTypes.INTEGER,
    name: DataTypes.STRING,
  }, {})
  PortionSize.associate = function(models) {
    // associations can be defined here
  }
  return PortionSize
}
