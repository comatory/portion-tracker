const { Router } = require('express')
const { Op } = require('sequelize')

const { User, Role, Activity, Portion, ActivityPortion } = require('../models')
const ApiUtils = require('../utils/api-utils')

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll()
    ApiUtils.validResponse(users, res)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  const { email, password, passwordConfirmation, RoleIds } = req.body

  if (!RoleIds || RoleIds.length < 1) {
    res.status(500).send({ error: 'You must provide at least one role for the user.' })
  }

  try {
    const user = await User.create({
      email,
      password,
      passwordConfirmation,
    })

    await user.setRoles(RoleIds)

    ApiUtils.validResponse(user, res)
  } catch (error) {
    next(error)
  }
})

router.get('/current_user', async (req, res, next) => {
  try {
    const user = req.session.user
    ApiUtils.validResponse(user, res)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, {
      include: [ Role ],
    })
    ApiUtils.validResponse(user, res)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  const { email, password, RoleIds } = req.body
  try {
    const user = await User.findById(req.params.id)
    await user.update({
      email,
      password,
    })

    if (RoleIds && RoleIds.length > 0) {
      await user.setRoles(RoleIds)
    }

    ApiUtils.validResponse(user, res)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    await user.destroy()

    ApiUtils.validResponse(user, res)
  } catch (error) {
    next(error)
  }
})

router.get('/:id/activities', async (req, res, next) => {
  try {
    const { offset, limit } = ApiUtils.getPagination(req)
    const user = await User.findById(req.params.id)
    const userActivites = await Activity.findAndCountAll({
      offset,
      limit,
      where: {
        UserId: user ? user.id : null,
      },
      include: {
        model: Portion,
      },
    })

    ApiUtils.validResponse(userActivites, res, {
      paginate: true,
      offset,
      limit,
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:id/portions', async (req, res, next) => {
  try {
    const { offset, limit, sortBy } = ApiUtils.getPagination(req)
    const user = await User.findById(req.params.id)
    const userActivitesIds = await Activity
      .findAll({
        attributes: [ 'id', 'createdAt' ],
        where: {
          UserId: user ? user.id : null,
        },
      })
      .map((query) => {
        return query.id
      })
      .map(q => q)

    const activityPortionIds = await ActivityPortion.findAll({
      where: {
        ActivityId: {
          [Op.in]: userActivitesIds,
        },
      },
    })
      .map((query) => {
        return query.PortionId
      })
      .map(q => q)

    const userPortions = await Portion.findAndCountAll({
      where: {
        id: {
          [Op.in]: activityPortionIds,
        },
      },
      order: [[ sortBy, 'DESC' ]],
      offset,
      limit,
    })

    ApiUtils.validResponse(userPortions, res, {
      paginate: true,
      offset,
      limit,
      sortBy,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
