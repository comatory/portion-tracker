const url = require('url')

class DevUtils {
  static isDevelopment() {
    return Boolean(process.env.NODE_ENV === 'development')
  }

  static isProduction() {
    return Boolean(process.env.NODE_ENV === 'production')
  }

  static getPoolParameters(config) {
    if (DevUtils.isDevelopment()) {
      return {
        host: config.host,
        user: config.username,
        database: config.database,
        port: config.port,
      }
    }
    const params = url.parse(process.env.DATABASE_URL)
    const auth = params.auth.split(':')

    return {
      user: auth[0],
      password: auth[1],
      host: params.hostname,
      port: params.port,
      database: params.pathname.split('/')[1],
      // ssl: true,
    }
  }
}

module.exports = DevUtils
