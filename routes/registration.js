const { Router } = require('express')
const hat = require('hat')
const { Role, User } = require('../models')
const ApiUtils = require('../utils/api-utils')
const RegistrationUtils = require('../utils/registration-utils')

const router = Router()

router.post('/', async (req, res, next) => {
  const { email, password, passwordConfirmation } = req.body

  try {
    const userRole = await Role.findOne({ name: 'user' })
    const RoleIds = [ userRole.id ]
    User.create({
      email,
      password,
      passwordConfirmation,
    }).then((user) => {
      user.setRoles(RoleIds)
      RegistrationUtils.sendVerificationEmail(user.email, user.verificationCode)
      ApiUtils.validResponse(user, res)
    }).catch((error) => {
      error.statusCode = 422
      ApiUtils.sequelizeError(error, req, res, next)
    })
  } catch (error) {
    next(error)
  }
})

router.post('/verify', async (req, res, next) => {
  const { verificationCode } = req.body

  try {
    if (req.session.user.verificationCode === verificationCode) {
      const user = await User.findOne({
        where: {
          id: req.session.user.id,
        },
        include: [ Role ],
      })

      if (user) {
        await user.update({
          verified: true,
          verificationCode: hat(),
        })

        req.session.user = user.toJSON()
        req.session.save((err) => {
          if (err) {
            next(err)
          }
          const verifiedResponse = ApiUtils.setVerifyHeader(req, res)
          ApiUtils.validResponse(user, verifiedResponse)
        })
      } else {
        next(new Error('User not found'))
      }
    } else {
      res.status(403).json({ message: 'Invalid verification code' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
