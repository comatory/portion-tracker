const { Router } = require('express')
const { Op } = require('sequelize')
const { Activity, Portion, ActivityPortion } = require('../models')
const ApiUtils = require('../utils/api-utils')

const router = Router()

router.post('/', async (req, res, next) => {
  const { datetime, note, Portions, UserId } = req.body

  try {
    const activity = await Activity.create({
      datetime: datetime || new Date(),
      note,
      UserId,
      Portions: (Portions || []).map((portion) => {
        return {
          note: portion.note,
          calories: portion.calories,
          PortionSizeId: portion.PortionSizeId,
          PortionHealthinessId: portion.PortionHealthinessId,
        }
      }),
    }, {
      include: [ Portion ],
    })

    ApiUtils.validResponse(activity, res)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const activities = await Activity.findAll()
    ApiUtils.validResponse(activities, res)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  const activity = await Activity.findById(id, { include: Portion })

  try {
    ApiUtils.validResponse(activity, res)
  } catch (error) {
    next(error)
  }
})

router.get('/:id/portions', async (req, res, next) => {
  const { id } = req.params
  try {
    const activityPortionIdsQuery = await ActivityPortion.findAll({
      attributes: [ 'PortionId' ],
      where: {
        ActivityId: id,
      },
    })
    const activityPortionIds = activityPortionIdsQuery
      .map((query) => {
        return query.PortionId
      })
      .filter((q) => q)
    const portions = await Portion.findAll({
      where: {
        id: {
          [Op.in]: activityPortionIds,
        },
      },
    })
    ApiUtils.validResponse(portions, res)
  } catch (error) {
    next(error)
  }
})

module.exports = router
