const permissions = require('./permissions.json')

class PermissionUtils {
  static can(user, entities, actions) {
    if (!user) {
      throw new Error('No user specified!')
    }

    if (!user.Roles.length) {
      throw new Error('Please define role on user!')
    }

    const roleNames = user.Roles.map(role => role.name)
    const entityPermissions = permissions[entities]

    if (!entityPermissions) {
      throw new Error(`Permissions for ${user.email} on ${entities} resource not defined!`)
    }

    const rolePermissions = roleNames.reduce((names, roleName) => {
      const rolePermissions = entityPermissions[roleName] || []
      names.push(...rolePermissions)
      return names
    }, [])

    const notAllowed = actions.some((action) => {
      return !rolePermissions.includes(action)
    })

    return Boolean(!notAllowed)
  }

  static _can(role, entities, actions) {
    const entityPermissions = permissions[entities]

    if (!entityPermissions) {
      throw new Error(`Permissions for ${role.name} on ${entities} resource not defined!`)
    }

    const rolePermissions = entityPermissions[role.name] || []

    return PermissionUtils.roleCan(rolePermissions, actions)
  }

  static roleCan(rolePermissions, actions) {
    console.log(rolePermissions, actions)
    return actions.some((permission) => {
      return !rolePermissions.includes(permission)
    })
  }

  static unauthorizedResponse(response) {
    response.status(403).send({ error: 'Not allowed' })
  }
}

module.exports = PermissionUtils
