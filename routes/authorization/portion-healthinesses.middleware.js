const PermissionUtils = require('../../utils/permission-utils')

const authorizePortionHealthinesses = (req, res, next) => {
  switch (req.method) {
    case 'GET':
      if (PermissionUtils.can(req.session.user, 'portionHealthinesses', [ 'getAll' ]) ||
        PermissionUtils.can(req.session.user, 'portionHealthinesses', [ 'get' ])
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
  authorizePortionHealthinesses,
}
