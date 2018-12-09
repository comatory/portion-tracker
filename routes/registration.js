const { Router } = require('express')
const hat = require('hat')
const { Role, User } = require('../models')
const ApiUtils = require('../utils/api-utils')
const RegistrationUtils = require('../utils/registration-utils')
const ErrorUtils = require('../utils/error-utils')

const router = Router()

router.post('/', ApiUtils.wrapAsync(async (req, res, next) => {
  const { email, password, passwordConfirmation } = req.body

  const userRole = await Role.findOne({ name: 'user' })
  const RoleIds = [ userRole.id ]
  const user = await User.create({
    email,
    password,
    passwordConfirmation,
  })
  user.setRoles(RoleIds)

  RegistrationUtils.sendVerificationEmail(user.email, user.verificationCode)

  ApiUtils.validResponse(user, res)
}))

router.post('/verify', ApiUtils.wrapAsync(async (req, res, next) => {
  const { verificationCode } = req.body

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
      next(ErrorUtils.createResourceNotFoundError('User not found'))
    }
  } else {
    next(ErrorUtils.createValidationErrorBody('Wrong verification code.'))
  }
}))

module.exports = router
