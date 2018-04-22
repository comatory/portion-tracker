import { List, Map } from 'immutable'
import hat from 'hat'

import Store from './store'
import Portion from '../entities/portion'

export default class FormStore extends Store {
  constructor(services) {
    super(services)

    this.exportPublicMethods({
      getRootValues: this.getRootValues,
    })


    this._state = Map({
      portions: List([
        Portion.fromData({
          id: hat(),
        }),
      ]),
    })

    this._formActions = services.formActions
    this.bindListeners({
      handleSetPortion: this._formActions.SET_PORTION,
      handleRemovePortion: this._formActions.REMOVE_PORTION,
      handleUpdatePortion: this._formActions.UPDATE_PORTION,
      handleClearPortions: this._formActions.CLEAR_PORTIONS,
    })
  }

  getRootValues = (root) => {
    return this._state.get(root)
  }

  _getRoot(root) {
    return this._state.get(root)
  }

  handleSetPortion = (value) => {
    let portions = this._getRoot('portions')

    portions = portions.push(value)

    this._state = this._state.set('portions', portions)
  }

  handleRemovePortion = (id) => {
    let portions = this._getRoot('portions')
    const portionToRemove = portions.find((portion) => {
      return portion.get('id') === id
    })

    const index = portions.findIndex((portion) => {
      return portion === portionToRemove
    })

    portions = portions.delete(index)

    this._state = this._state.set('portions', portions)
  }

  handleUpdatePortion = ({ id, value }) => {
    let portions = this._getRoot('portions')
    const portionToUpdate = portions.find((portion) => {
      return portion.get('id') === id
    })

    const index = portions.findIndex((portion) => {
      return portion === portionToUpdate 
    }) 

    portions = portions.set(index, value)

    this._state = this._state.set('portions', portions)
  }

  handleClearPortions = () => {
    this._state = this._state.set('portions', List([
      new Portion() 
    ]))
  }
  
}
