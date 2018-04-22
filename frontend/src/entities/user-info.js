import { Record } from 'immutable'

const defaults = {
  id: null,
  email: null,
}

export default class UserInfo extends Record(defaults) {
  static fromData(data = {}) {
    const cleanData = {
      id: data['id'] || null,
      email: data['email'] || null,
    }

    return new UserInfo(cleanData)
  }
}
