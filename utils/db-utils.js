const ErrorUtils = require('../utils/error-utils')
class DbUtils {
  static async getCurrentUser(request, dbUser) {
    if (!request.session.user) {
      throw ErrorUtils.createResourceNotFoundError('User has no session!')
    }

    const currentUser = await dbUser.findById(request.session.user.id)

    if (!currentUser) {
      throw ErrorUtils.createResourceNotFoundError('User does not exist')
    }

    return currentUser
  }

  static async isUserAdmin(request, dbUser) {
    const currentUser = await DbUtils.getCurrentUser(request, dbUser)

    return currentUser.isAdmin()
  }
}

module.exports = DbUtils
