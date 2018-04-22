import { List, Map } from 'immutable'

import Store from './store'

export default class UiStore extends Store {
  constructor(services) {
    super(services)

    this.exportPublicMethods({
      getTableFilter: this.getTableFilter,
    })

    this._state = Map({
      uiItems: Map(),
      tableFilters: List(),
    })

    this._uiActions = services.uiActions
    this.bindListeners({
      handleRegisterUiItem: this._uiActions.REGISTER_UI_ITEM,
      handleUnregisterUiItem: this._uiActions.UNREGISTER_UI_ITEM,
      handleSetTableFilter: this._uiActions.SET_TABLE_FILTER,
      handleRemoveTableFilter: this._uiActions.REMOVE_TABLE_FILTER,
    })
  }

  handleRegisterUiItem = ({ id, item }) => {
    this._state = this._state.setIn([ 'uiItems', id ], item)
  }

  handleUnregisterUiItem = (id) => {
    this._state = this._state.deleteIn([ 'uiItems', id ])
  }

  handleSetTableFilter = (filter) => {
    let tableFilters = this._state.get('tableFilters')
    const id = filter.get('id')
    const index = tableFilters.findIndex((filter) => {
      return filter.get('id') === id
    })

    tableFilters = index === -1 ? tableFilters.push(filter) : tableFilters.set(index, filter)
    
    this._state = this._state.set('tableFilters', tableFilters)
  }

  handleRemoveTableFilter = (id) => {
    const index = this._state.get('tableFilters').findIndex((filter) => {
      return filter.get('id') === id
    })
    this._state = this._state.deleteIn([ 'tableFilters', index ])
  }

  getTableFilter = (id) => {
    return this._state.get('tableFilters').find((tableFilter) => {
      return tableFilter.get('id') === id
    })
  }

}
