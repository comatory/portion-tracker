const PermissionUtils = require('../../utils/permission-utils')
const { Activity, ActivityPortion } = require('../../models')

const authorizePortions = async (req, res, next) => {
  const userActivitiesIds = await Activity.findAll({
    attributes: [ 'id' ],
    where: {
      UserId: req.session.user.id,
    },
  }).map((a) => a.id)

  const activityPortionsIds = await ActivityPortion.findAll({
    attributes: [ 'PortionId' ],
    where: {
      ActivityId: userActivitiesIds,
    },
  }).map((p) => parseInt(p.PortionId))

  const portionIds = req.body.ids.map((i) => parseInt(i))

  const notAllowed = portionIds.some((id) => {
    return !activityPortionsIds.includes(id)
  })

  switch (req.method) {
    case 'DELETE':
      if (PermissionUtils.can(req.session.user, 'portions', [ 'deleteAll' ])) {
        next()
      } else if (PermissionUtils.can(req.session.user, 'portions', [ 'delete' ]) &&
        !notAllowed
      ) {
        next()
      }
      break
    default:
      PermissionUtils.unauthorizedResponse(res)
  }
}

const authorizePortion = async (req, res, next) => {
  const userActivitiesIds = await Activity.findAll({
    attributes: [ 'id' ],
    where: {
      UserId: req.session.user.id,
    },
  }).map((a) => a.id)

  const activityPortionsIds = await ActivityPortion.findAll({
    attributes: [ 'PortionId' ],
    where: {
      ActivityId: userActivitiesIds,
    },
  }).map((p) => parseInt(p.PortionId))

  const portionId = parseInt(req.params.id)

  switch (req.method) {
    case 'PUT':
      if (PermissionUtils.can(req.session.user, 'portions', [ 'updateAll' ])) {
        next()
      } else if (PermissionUtils.can(req.session.user, 'portions', [ 'update' ]) &&
      activityPortionsIds.includes(portionId)
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
  authorizePortions,
  authorizePortion,
}
