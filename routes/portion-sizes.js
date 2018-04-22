const { Router } = require('express')
const { PortionSize } = require('../models')
const ApiUtils = require('../utils/api-utils')

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const portionSizes = await PortionSize.findAll()

    ApiUtils.validResponse(portionSizes, res)
  } catch (error) {
    next(error)
  }
})

module.exports = router
