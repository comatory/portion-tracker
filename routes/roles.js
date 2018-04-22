const { Router } = require('express')
const { Role } = require('../models')
const ApiUtils = require('../utils/api-utils')

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const roles = await Role.findAll()
    ApiUtils.validResponse(roles, res)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  const { name, UserId } = req.body

  try {
    const role = await Role.create({
      name,
      UserId,
    })
    ApiUtils.validResponse(role, res)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id)
    ApiUtils.validResponse(role, res)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id)
    const { name, UserId } = req.body

    await role.update({
      name,
      UserId,
    })

    ApiUtils.validResponse(role, res)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id)
    await role.destroy()
    ApiUtils.validResponse(role, res, { message: 'ok' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
