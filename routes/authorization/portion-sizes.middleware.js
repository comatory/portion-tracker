const PermissionUtils = require('../../utils/permission-utils')

const authorizePortionSizes = (req, res, next) => {
  switch (req.method) {
    case 'GET':
      if (PermissionUtils.can(req.session.user, 'portionSizes', [ 'getAll' ]) ||
        PermissionUtils.can(req.session.user, 'portionSizes', [ 'get' ])
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
  authorizePortionSizes,
}
