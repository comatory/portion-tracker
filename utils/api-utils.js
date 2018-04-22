const DEFAULT_OFFSET = 1
const DEFAULT_LIMIT = 5

class ApiUtils {
  static catchError(error, req, res, next) {
    let cleanedError = error
    if (Object.keys(error).length < 2 && error.message) {
      cleanedError = { message: error.message }
    }
    console.error(error)
    res.status(500).json(cleanedError)
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

    return {
      offset,
      limit,
      sortBy,
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

  static authorizeViaCookie(request, response, next) {
    if (request.cookies['portion-tracker']) {
      next()
    } else {
      response.status(403).json({ message: 'not authorized' })
    }
  }
}

module.exports = ApiUtils
