import { Map } from 'immutable'

import Store from './store'

export default class ConfigStore extends Store {
  constructor(services) {
    super(services)
    this._configActions = services.configActions
    this.bindListeners({
      handleSetApiUrl: this._configActions.SET_API_URL,
    })
    this._state = Map()
  }

  handleSetApiUrl(url) {
    this._state = this._state.set('apiUrl', url)
  }
}
