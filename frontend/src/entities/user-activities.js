import { List, Record } from 'immutable'

import Activity from './activity'

const defaults = {
  activities: List(),
}

export default class UserActivities extends Record(defaults) {
  static fromData(data = {}) {
    let cleanData = {
    }

    if (data.length > 0) {
      let userActivites = List()
      data.forEach((activity) => {
        userActivites = userActivites.push(Activity.fromData(activity))
      })

      cleanData = {
        ...cleanData,
        activities: userActivites,
      }
    }

    return new UserActivities(cleanData)
  }
}
