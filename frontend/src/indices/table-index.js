import { Map } from 'immutable'

export default class TableIndex {
  _index = Map()

  setPaginationIndex(id, indices) {
    this._index = this._index.set(id, indices)
  }

  getPaginationIndex(id) {
    return this._index.get(id)
  }
}
