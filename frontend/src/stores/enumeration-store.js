import { Map, List } from 'immutable'

import Store from './store'

export default class EnumerationStore extends Store {
  constructor(services) {
    super(services)

    this.exportPublicMethods({
      getEnumeration: this.getEnumeration,
    })

    this._enumerationActions = services.enumerationActions

    this.bindListeners({
      handleSetEnumeration: this._enumerationActions.SET_ENUMERATION,
    })
  }

  handleSetEnumeration({ root, enumerations }) {
    this._state = this._state.set(root, enumerations)
  }

  getEnumeration = (root) => {
    return this._state.get(root) || List()
  }
}
