'use strict'

const bcrypt = require('bcrypt')

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

  User.prototype.authenticate = function(value) {
    if (bcrypt.compareSync(value, this.passwordDigest)) {
      return this
    }
    return false
  }

  User.associate = function(models) {
    User.belongsToMany(models.Role, { through: 'UserRole' })
    User.hasMany(models.Activity)
  }

  return User
}
