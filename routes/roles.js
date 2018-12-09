const { Router } = require('express')
const { Role } = require('../models')
const ApiUtils = require('../utils/api-utils')
const {
  authorizeRoles,
  authorizeRole,
} = require('./authorization/roles.middleware')

const router = Router()

router.use('/', authorizeRoles)
router.get('/', ApiUtils.wrapAsync(async (req, res) => {
  const roles = await Role.findAll()
  ApiUtils.validResponse(roles, res)
}))

router.post('/', ApiUtils.wrapAsync(async (req, res) => {
  const { name, UserId } = req.body

  const role = await Role.create({
    name,
    UserId,
  })
  ApiUtils.validResponse(role, res)
}))

router.use('/:id', authorizeRole)
router.get('/:id', ApiUtils.wrapAsync(async (req, res) => {
  const role = await Role.findById(req.params.id)
  ApiUtils.validResponse(role, res)
}))

router.put('/:id', ApiUtils.wrapAsync(async (req, res) => {
  const role = await Role.findById(req.params.id)
  const { name, UserId } = req.body

  await role.update({
    name,
    UserId,
  })

  ApiUtils.validResponse(role, res)
}))

router.delete('/:id', ApiUtils.wrapAsync(async (req, res) => {
  const role = await Role.findById(req.params.id)
  await role.destroy()
  ApiUtils.validResponse(role, res, { message: 'ok' })
}))

module.exports = router
