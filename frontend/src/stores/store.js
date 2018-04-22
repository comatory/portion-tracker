import { Map } from 'immutable'

export default class Store {
  static config = {
    getState: (state) => {
      const { _state } = state
      return _state
    },
  }

  constructor(services) {
    this.exportPublicMethods({
      register: this.register,
    })
    this._state = Map()
  }

  register = (services) => {
  }

  unregister = (services) => {
  }
}
