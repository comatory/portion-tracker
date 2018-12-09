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
router.delete('/', ApiUtils.wrapAsync(async (req, res) => {
  const { ids } = req.body

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
}))

router.use('/:id', authorizePortion)
router.put('/:id', ApiUtils.wrapAsync(async (req, res) => {
  const id = req.params.id
  const { note, calories, PortionSizeId, PortionHealthinessId } = req.body
  const portion = await Portion.findById(id)

  await portion.update({ note, calories, PortionSizeId, PortionHealthinessId })

  ApiUtils.validResponse(portion, res)
}))

module.exports = router
