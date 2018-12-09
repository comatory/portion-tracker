const ErrorUtils = require('../utils/error-utils')
module.exports = (sequelize, DataTypes) => {
  var Activity = sequelize.define('Activity', {
    datetime: DataTypes.DATE,
    UserId: DataTypes.BIGINT,
  }, {
    validate: {
      hasPortions() {
        if (this.Portions.length < 1) {
          throw ErrorUtils.createValidationError('You must include at least one portion with each activity.')
        }
      },
    },
  })
  Activity.associate = function(models) {
    // associations can be defined here
    Activity.belongsTo(models.User, { foreignKey: { allowNull: false } })
    Activity.belongsToMany(models.Portion, {
      through: 'ActivityPortion',
    })
  }
  return Activity
}
