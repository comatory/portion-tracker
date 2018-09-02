const PermissionUtils = require('../../utils/permission-utils')

const authorizeRoles = async (req, res, next) => {
  switch (req.method) {
    case 'GET':
      if (PermissionUtils.can(req.session.user, 'roles', [ 'getAll' ])) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    case 'POST':
      if (PermissionUtils.can(req.session.user, 'roles', [ 'createAll' ])) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    default:
      PermissionUtils.unauthorizedResponse(res)
  }
}

const authorizeRole = async (req, res, next) => {
  switch (req.method) {
    case 'GET':
      if (PermissionUtils.can(req.session.user, 'roles', [ 'getAll' ])) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    case 'POST':
      if (PermissionUtils.can(req.session.user, 'roles', [ 'createAll' ])) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    case 'PUT':
      if (PermissionUtils.can(req.session.user, 'roles', [ 'updateAll' ])) {
        next()
      } else {
        PermissionUtils.unauthorizedResponse(res)
      }
      break
    case 'DELETE':
      if (PermissionUtils.can(req.session.user, 'roles', [ 'deleteAll' ])) {
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
  authorizeRoles,
  authorizeRole,
}
