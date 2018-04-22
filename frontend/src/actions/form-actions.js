export default class FormActions {
  setPortion(value) {
    return value
  }

  updatePortion(id, value) {
    return { id, value }
  }

  removePortion(id) {
    return id
  }

  clearPortions() {
    return 1
  }
}
