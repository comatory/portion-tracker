const { Router } = require('express')
const { Role, User } = require('../models')
const ApiUtils = require('../utils/api-utils')
const ErrorUtils = require('../utils/error-utils')

const router = Router()

router.post('/login', ApiUtils.wrapAsync(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where: { email },
    include: [ Role ],
  })

  if (!user) {
    next(ErrorUtils.createResourceNotFoundError('User not found.'))
  }

  await user.authenticate(password).then((user) => {
    req.session.user = user.toJSON()
    req.session.save((err) => {
      if (err) {
        next(err)
      }

      ApiUtils.validResponse(user, res)
    })
  })
}))

router.post('/logout', ApiUtils.wrapAsync((req, res) => {
  req.session.destroy()
  res.clearCookie('portion-tracker')

  ApiUtils.validResponse({ message: 'ok' }, res)
}))

module.exports = router

