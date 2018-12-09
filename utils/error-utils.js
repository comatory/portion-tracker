const { ValidationError, EmptyResultError } = require('sequelize')

class ErrorUtils {
  static setStatusCode(error) {
    if (error instanceof ValidationError) {
      error.statusCode = 422
    } else if (error instanceof EmptyResultError) {
      error.statusCode = 404
    } else if (!error.statusCode) {
      error.statusCode = 500
    }
    return error
  }

  static setErrorBody(error) {
    switch (error.statusCode) {
      case 422:
        error.formattedBody = ErrorUtils.createValidationErrorBody(error)
        break
      case 500:
      default:
        error.formattedBody = ErrorUtils.createGenericErrorBody(error)
    }
    return error
  }

  static createGenericErrorBody(error) {
    if (error.message) {
      return { message: error.message }
    }
    return { message: JSON.stringify(error) }
  }

  static createValidationErrorBody(error) {
    if (!error.errors) {
      return { message: JSON.stringify(error) }
    }

    return error.errors.reduce((acc, err, index) => {
      const addNewLine = index !== 0
      acc.message = `${acc.message || ''}${addNewLine ? '\n' : ''}${err.message}`
      return acc
    }, {})
  }

  static createValidationError(message) {
    const error = new ValidationError()

    error.errors = [ { message } ]

    return error
  }

  static createResourceNotFoundError(message) {
    const error = new EmptyResultError()

    error.message = message

    return error
  }
}

module.exports = ErrorUtils
