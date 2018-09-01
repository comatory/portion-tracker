import { List, Record } from 'immutable'
import moment from 'moment'

const defaults = {
  id: null,
  createdAt: null,
  updatedAt: null,
  note: null,
  portionHealthinessId: null,
  portionSizeId: null,
  calories: null,
}
export default class Portion extends Record(defaults) {
  static fromData(data = {}) {
    let cleanData = {
      id: data['id'] || null,
      createdAt: data['createdAt'] ? moment(data['createdAt']) : null,
      updatedAt: data['updatedAt'] ? moment(data['updatedAt']) : null,
      note: data['note'] || '',
      portionHealthinessId: data['PortionHealthinessId'] ? Number.parseInt(data['PortionHealthinessId']) : null,
      portionSizeId: data['PortionSizeId'] ? Number.parseInt(data['PortionSizeId']) : null,
      calories: data['calories'] ? Number.parseInt(data['calories']) : null,
    }

    return new Portion(cleanData)
  }
}