const { Router } = require('express')
const { PortionHealthiness } = require('../models')
const ApiUtils = require('../utils/api-utils')

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const portionHealthinesses = await PortionHealthiness.findAll()

    ApiUtils.validResponse(portionHealthinesses, res)
  } catch (error) {
    next(error)
  }
})

module.exports = router
