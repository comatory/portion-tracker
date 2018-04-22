import { Record, OrderedMap } from 'immutable'

const defaults = {
  id: null,
  entityId: null,
  limit: null,
  page: null,
  pages: null,
  sortColumn: null,
  query: OrderedMap(),
}

export default class TableFilter extends Record(defaults) {
  static fromData(data = {}) {
    let cleanData = {
      id: data['id'] || null,
      entityId: data['entityId'] || null,
      limit: data['limit'] || 5,
      page: data['page'] || null,
      pages: data['pages'] || null,
      sortColumn: data['sortColumn'] || null,
      query: data['query'] || OrderedMap(),
    }

    return new TableFilter(cleanData)
  }

  getId() {
    return `${this.get('entityId')}\
/page:${this.get('page')}\
/limit:${this.get('limit')}\
/sort:${this.get('sortColumn')}\
${this.get('query').toSeq().toArray().toString()}`
  }
}
