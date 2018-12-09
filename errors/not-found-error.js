class NotFoundError {
  constructor(message = null) {
    this.message = message || 'Not found'
    this.statusCode = 404
  }
}

module.exports = NotFoundError
