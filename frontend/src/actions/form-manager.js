import hat from 'hat'

import Manager from './manager'
import Portion from '../entities/portion'
import ApiUtils from '../utils/api-utils'

export default class FormManager extends Manager {
  constructor(services) {
    super(services)
    this._formActions = services.formActions
    this._apiManager = services.apiManager
  }

  addPortion(portion = null) {
    const newPortion = portion || Portion.fromData({
      id: hat(),
    })

    this._formActions.setPortion(newPortion)
  }

  updatePortion(id, portion) {
    this._formActions.updatePortion(id, portion)
  }

  removePortion(id) {
    this._formActions.removePortion(id)
  }

  submitActivityForm(values, userInfo) {
    const data = ApiUtils.normalizeActivityFormData(values, userInfo)
    this._apiManager.createNewActivity(data)
  }

  submitUpdatePortionForm(portion) {
    const data = ApiUtils.normalizePortionFormData(portion)
    this._apiManager.updateActivityPortion(portion.get('id'), data)
  }

  deletePortionForm(portionIds) {
    const ids = portionIds.toJS()
    this._apiManager.deleteActivityPortions({ ids })
  }

  clearActivityForm() {
    setImmediate(() => {
      this._formActions.clearPortions()
    })
  }
}
