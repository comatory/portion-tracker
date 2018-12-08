const { ValidationError } = require('sequelize')

class ErrorUtils {
  static setStatusCode(error) {
    if (error instanceof ValidationError) {
      error.statusCode = 403
    } else {
      error.statusCode = 500
    }
    return error
  }

  static setErrorBody(error) {
    switch (error.statusCode) {
      case 403:
        error.formattedBody = ErrorUtils.createValidationErrorBody(error)
        break
      case 500:
      default:
        error.formattedBody = ErrorUtils.createGenericErrorBody(error)
    }
    return error
  }

  static createGenericErrorBody(error) {
    if (Object.keys(error).length < 2 && error.message) {
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
    const error = new ValidationError(message)

    error.errors = [ { message } ]

    return error
  }
}

module.exports = ErrorUtils
