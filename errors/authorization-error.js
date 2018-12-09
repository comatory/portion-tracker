class AuthorizationError {
  constructor(message = null) {
    this.message = message || 'Not authorized!'
    this.statusCode = 403
  }
}

module.exports = AuthorizationError
