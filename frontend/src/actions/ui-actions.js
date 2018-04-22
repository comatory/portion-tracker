export default class UiActions {
  registerUiItem(id, item) {
    return { id, item }
  }

  unregisterUiItem(id) {
    return id
  }

  setTableFilter(filter) {
    return filter
  }

  removeTableFilter(id) {
    return id
  }
}
