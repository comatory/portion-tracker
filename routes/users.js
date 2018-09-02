const { Router } = require('express')
const { Op } = require('sequelize')

const { User, Role, Activity, Portion, ActivityPortion } = require('../models')
const ApiUtils = require('../utils/api-utils')
const DbUtils = require('../utils/db-utils')

const {
  authorizeUsers,
  authorizeUser,
  authorizeUserActivities,
  authorizeUserPortions,
} = require('./authorization/users.middleware')

const router = Router()

router.use('/', authorizeUsers)
router.get('/', async (req, res, next) => {
  try {
    const isAdmin = await DbUtils.isUserAdmin(req, User)
    const users = isAdmin ? await User.findAll() : await User.findById(req.session.user.id)
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
    const userId = req.session.user.id
    const user = await User.findById(userId, { include: [ Role ] })
    ApiUtils.validResponse(user, res)
  } catch (error) {
    next(error)
  }
})

router.use('/:id', authorizeUser)
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
    let update = {}
    if (email) {
      update = { ...update, email }
    }
    if (password) {
      update = { ...update, password }
    }
    await user.update(update)

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

router.use('/:id/activities', authorizeUserActivities)
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

router.use('/:id/portions', authorizeUserPortions)
router.get('/:id/portions', async (req, res, next) => {
  try {
    const { offset, limit, sortBy, sortDir } = ApiUtils.getPagination(req)
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
      order: [[ sortBy, sortDir ]],
      offset,
      limit,
    })

    ApiUtils.validResponse(userPortions, res, {
      paginate: true,
      offset,
      limit,
      sortBy,
      sortDir,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
