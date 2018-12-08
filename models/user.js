'use strict'

const bcrypt = require('bcrypt')
const hat = require('hat')

const ErrorUtils = require('../utils/error-utils.js')

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email must be unique',
      },
      validate: {
        isEmail: {
          msg: 'Email address must be valid',
        },
        len: {
          args: [6, 256],
          msg: 'Email must have length between 6 and 256 characters.',
        },
      },
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      allowNull: false,
      type: DataTypes.VIRTUAL,
      validate: {
        notEmpty: true,
      },
    },
    passwordConfirmation: {
      type: DataTypes.VIRTUAL,
      validate: {
        notEmpty: true,
      },
    },
    verified: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true,
      },
      defaultValue: false,
    },
    verificationCode: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
      defaultValue: hat(),
    },
  }, {
    hooks: {
      beforeCreate: (user) => {
        try {
          if (user.password) {
            hasSecurePassword(user)
          }
          return user
        } catch (err) {
          return sequelize.Promise.reject(err)
        }
      },
    },
    defaultScope: {
      attributes: { exclude: [ 'passwordDigest' ] },
    },
    scopes: {
      withPassword: {
        attributes: { include: [ 'passwordDigest' ] },
      },
    },
  })

  const hasSecurePassword = (user, options, callback) => {
    if (user.password !== user.passwordConfirmation) {
      throw new Error("Password confirmation doesn't match Password")
    }

    const hash = bcrypt.hashSync(user.password.toString(), 10, (err, hash) => {
      if (err) {
        throw err
      }
      return hash
    })

    user.set('passwordDigest', hash)
    return user
  }

  User.prototype.authenticate = async function(value) {
    const user = await sequelize.models.User.scope('withPassword').findById(this.id)

    if (!user) {
      throw ErrorUtils.createValidationError('User not found!')
    }

    if (bcrypt.compareSync(value, user.passwordDigest)) {
      return this
    }
    throw ErrorUtils.createValidationError('Wrong user name or password.')
  }

  User.prototype.isAdmin = async function() {
    const adminRole = await sequelize.models.Role.findOne({ name: 'admin' })
    const hasAdminRole = await this.hasRoles(adminRole)

    return hasAdminRole
  }

  User.associate = function(models) {
    User.belongsToMany(models.Role, { through: 'UserRole' })
    User.hasMany(models.Activity)
  }

  return User
}
