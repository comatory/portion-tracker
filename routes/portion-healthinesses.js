const { Router } = require('express')
const { PortionHealthiness } = require('../models')
const ApiUtils = require('../utils/api-utils')
const { authorizePortionHealthinesses } = require('./authorization/portion-healthinesses.middleware')

const router = Router()

router.use('/', authorizePortionHealthinesses)
router.get('/', ApiUtils.wrapAsync(async (req, res) => {
  const portionHealthinesses = await PortionHealthiness.findAll()

  ApiUtils.validResponse(portionHealthinesses, res)
}))

module.exports = router
