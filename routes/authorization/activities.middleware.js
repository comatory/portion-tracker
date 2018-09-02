const PermissionUtils = require('../../utils/permission-utils')
const { Activity } = require('../../models')

const authorizeActivities = (req, res, next) => {
  const UserId = parseInt(req.body.UserId)

  switch (req.method) {
    case 'GET':
      if (PermissionUtils.can(req.session.user, 'activities', [ 'getAll' ]) ||
        PermissionUtils.can(req.session.user, 'activities', [ 'get' ])) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    case 'POST':
      if (PermissionUtils.can(req.session.user, 'activities', [ 'createAll' ])) {
        next()
      } else if (PermissionUtils.can(req.session.user, 'activities', [ 'create' ]) &&
        UserId && UserId === req.session.user.id) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    default:
      PermissionUtils.unauthorizedResponse(res)
  }
}

const authorizeActivity = async (req, res, next) => {
  const activityIds = await Activity.findAll({
    attributes: [ 'id' ],
    where: {
      UserId: req.session.user.id,
    },
  }).map((m) => m.id)
  const activityId = parseInt(req.params.id)

  switch (req.method) {
    case 'GET':
      if (PermissionUtils.can(req.session.user, 'activities', [ 'getAll' ])) {
        next()
      } else if (PermissionUtils.can(req.session.user, 'activities', [ 'get' ]) &&
        activityIds.includes(activityId)
      ) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    default:
      PermissionUtils.unauthorizedResponse(res)
  }
}

module.exports = {
  authorizeActivities,
  authorizeActivity,
}
