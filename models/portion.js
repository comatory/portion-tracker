'use strict'
module.exports = (sequelize, DataTypes) => {
  var Portion = sequelize.define('Portion', {
    note: DataTypes.STRING,
    calories: DataTypes.INTEGER,
  }, {

  })
  Portion.associate = function(models) {
    // associations can be defined here
    Portion.belongsToMany(models.Activity, {
      through: 'ActivityPortion',
    })
    Portion.belongsTo(models.PortionSize)
    Portion.belongsTo(models.PortionHealthiness)
  }
  return Portion
}
