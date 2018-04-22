import { List, Record } from 'immutable'

import Portion from './portion'

const defaults = {
  id: null,
  userId: null,
  dateTime: null,
  portions: List(),
}

export default class Activity extends Record(defaults) {

  static fromData(data = {}) {
    let cleanData = {
      id: data['id'] || null,
      userId: data['UserId'] || null,
      dateTime: data['datetime'] || null,
    }

    if (data['Portions'] && data['Portions'].length > 0) {
      let portions = List() 
      data['Portions'].forEach((portion) => {
        portions = portions.push(Portion.fromData(portion))
      })

      cleanData = {
        ...cleanData,
        portions,
      }
    }

    return new Activity(cleanData)
  }
}
