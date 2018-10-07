const { Router } = require('express')
const { Op } = require('sequelize')

const { Portion } = require('../models')
const ApiUtils = require('../utils/api-utils')
const {
  authorizePortion,
  authorizePortions,
} = require('./authorization/portions.middleware')

const router = Router()

router.use('/', authorizePortions)
router.delete('/', async (req, res, next) => {
  const { ids } = req.body

  try {
    await Portion.update({
      active: false,
    }, {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    })

    ApiUtils.validResponse(ids, res)
  } catch (error) {
    next(error)
  }
})

router.use('/:id', authorizePortion)
router.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const { note, calories, PortionSizeId, PortionHealthinessId } = req.body
  const portion = await Portion.findById(id)

  try {
    await portion.update({ note, calories, PortionSizeId, PortionHealthinessId })

    ApiUtils.validResponse(portion, res)
  } catch (error) {
    next(error)
  }
})

module.exports = router
