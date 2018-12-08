const { Router } = require('express')
const { PortionSize } = require('../models')
const ApiUtils = require('../utils/api-utils')
const { authorizePortionSizes } = require('./authorization/portion-sizes.middleware')

const router = Router()

router.use('/', authorizePortionSizes)
router.get('/', ApiUtils.wrapAsync(async (req, res) => {
  const portionSizes = await PortionSize.findAll()

  ApiUtils.validResponse(portionSizes, res)
}))

module.exports = router
