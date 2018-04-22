module.exports = (sequelize, DataTypes) => {
  var ActivityPortion = sequelize.define('ActivityPortion', {
    PortionId: DataTypes.BIGINT,
    ActivityId: DataTypes.BIGINT,
  }, {})
  ActivityPortion.associate = function(models) {
    ActivityPortion.belongsTo(models.Portion, { foreignKey: { allowNull: false } })
    ActivityPortion.belongsTo(models.Activity, { foreignKey: { allowNull: false } })
    // associations can be defined here
  }
  return ActivityPortion
}
