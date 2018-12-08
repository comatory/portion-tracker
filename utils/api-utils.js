const DEFAULT_OFFSET = 1
const DEFAULT_LIMIT = 5

class ApiUtils {
  static wrapAsync(fn) {
    return (req, res, next) => {
      fn(req, res, next).catch(next)
    }
  }

  static catchError(error, req, res, next) {
    let cleanedError = error
    if (Object.keys(error).length < 2 && error.message) {
      cleanedError = { message: error.message }
    }
    console.error(error)
    res.status(error.statusCode || 500).json(cleanedError)
  }

  static sequelizeError(error, req, res, next) {
    ApiUtils.catchError(error, req, res, next)
  }

  static validResponse(entity, response, options = {}) {
    let cleanResponse = entity
    if (Array.isArray(entity)) {
      cleanResponse = entity
    }

    if (options.paginate) {
      cleanResponse = ApiUtils.createPagination(entity, {
        limit: options.limit || DEFAULT_LIMIT,
        offset: options.offset || DEFAULT_OFFSET,
        sortBy: options.sortBy,
        sortDir: options.sortDir,
      })
    }

    if (options.message) {
      cleanResponse = { message: options.message }
    }

    return response.status(200).json(cleanResponse)
  }

  static getPagination(request) {
    const pagination = request.body.pagination || request.query || {}

    const limit = pagination.limit || DEFAULT_LIMIT
    const offset = ((pagination.offset || pagination.page || DEFAULT_OFFSET) - 1) * limit
    const sortBy = request.body.sortBy || request.query.sortBy || {}
    const sortDir = request.body.sortDir || request.query.sortDir || 'DESC'

    return {
      offset,
      limit,
      sortBy,
      sortDir,
    }
  }

  static createPagination(entity, options) {
    let cleanPagination = {
      pages: Math.ceil(entity.count / options.limit),
      page: Math.round(options.offset / options.limit + 1),
      result: entity.rows,
    }

    if (options.sortBy) {
      cleanPagination = {
        ...cleanPagination,
        sortBy: options.sortBy,
        sortDir: options.sortDir,
      }
    }

    return cleanPagination
  }

  static authorize(request, response, next) {
    if (request.session.user && request.cookies['portion-tracker']) {
      next()
    } else {
      response.status(403).json({ message: 'not authorized' })
    }
  }

  static verifyUser(request, response, next) {
    if (!request.session.user) {
      next()
    }

    const verified = Boolean(request.session.user.verified)

    const verifiedResponse = ApiUtils.setVerifyHeader(request, response)

    if (!verified) {
      verifiedResponse.status(403).json({ message: 'user not verified' })
    } else {
      next()
    }
  }

  static setVerifyHeader(request, response) {
    const verified = Boolean(request.session.user.verified)

    response.set('X-User-Verified', verified)

    return response
  }
}

module.exports = ApiUtils
