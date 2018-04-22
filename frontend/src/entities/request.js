import { Record } from 'immutable'

const defaults = {
  id: null,
  requestUrl: null,
  method: null,
  payload: {},
  error: null,
  options: null,
}

export default class Request extends Record(defaults) {
  static fromData(data = {}) {
    const cleanData = {
      id: data['id'] || null,
      method: data['method'] || 'GET',
      requestUrl: data['requestUrl'] || null,
      payload: data['payload'] || {},
      error: data['error'] || null,
      options: data['options'] || null,
    }

    return new Request(cleanData)
  }

  isError() {
    return Boolean(this.error)
  }
}
