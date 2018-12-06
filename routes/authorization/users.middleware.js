const PermissionUtils = require('../../utils/permission-utils')
const { User } = require('../../models')

const authorizeUsers = async (req, res, next) => {
  switch (req.method) {
    case 'GET':
      if (PermissionUtils.can(req.session.user, 'users', [ 'getAll' ]) ||
        PermissionUtils.can(req.session.user, 'users', [ 'get' ])) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    case 'POST':
      if (PermissionUtils.can(req.session.user, 'users', [ 'createAll' ])) {
        next()
      } else if (PermissionUtils.can(req.session.user, 'users', [ 'create' ])) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    default:
      next()
  }
}

const authorizeUser = async (req, res, next) => {
  const user = await User.findById(req.params.id)
  switch (req.method) {
    case 'GET':
      if (PermissionUtils.can(req.session.user, 'users', [ 'getAll' ])) {
        next()
      } else if (PermissionUtils.can(req.session.user, 'users', [ 'get' ]) &&
        user && user.id === req.session.user.id
      ) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    case 'PUT':
      if (PermissionUtils.can(req.session.user, 'users', [ 'updateAll' ])) {
        next()
      } else if (PermissionUtils.can(req.session.user, 'users', [ 'update' ])) {
        if (user && user.id === req.session.user.id) {
          next()
        } else {
          PermissionUtils.unauthorizedResponse(res)
        }
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    case 'DELETE':
      if (PermissionUtils.can(req.session.user, 'users', [ 'deleteAll' ])) {
        if (user && user.id !== req.session.user.id) {
          next()
        } else {
          PermissionUtils.unauthorizedResponse(res)
        }
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    default:
      PermissionUtils.unauthorizedResponse(res)
  }
}

const authorizeUserActivities = async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (PermissionUtils.can(req.session.user, 'users', [ 'activitiesAll' ])) {
    return next()
  } else if (PermissionUtils.can(req.session.user, 'users', [ 'activities' ]) &&
    user && user.id === req.session.user.id
  ) {
    return next()
  } else {
    return PermissionUtils.unauthorizedResponse(res)
  }
}

const authorizeUserPortions = async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (PermissionUtils.can(req.session.user, 'users', [ 'portionsAll' ])) {
    return next()
  } else if (PermissionUtils.can(req.session.user, 'users', [ 'portions' ]) &&
    user && user.id === req.session.user.id
  ) {
    return next()
  } else {
    return PermissionUtils.unauthorizedResponse(res)
  }
}

module.exports = {
  authorizeUsers,
  authorizeUser,
  authorizeUserActivities,
  authorizeUserPortions,
}
