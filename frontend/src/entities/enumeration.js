import { Record } from 'immutable'

const defaults = {
  id: null,
  name: null,
  value: null,
}

export default class Enumeration extends Record(defaults) {
  static fromData(data = {}) {
    let cleanData = {
      id: data['id'] || null,
      name: data['name'] || '',
      value: data['value'] || null,
    }

    return new Enumeration(cleanData)
  }
}
