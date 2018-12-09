class AuthenticationError {
  constructor(message = null) {
    this.message = message || 'Not authenticated!'
    this.statusCode = 401
  }
}

module.exports = AuthenticationError
