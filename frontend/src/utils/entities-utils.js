import moment from 'moment'

export default class EntitiesUtils {
  static sortEntities(entities, filter) {
    const sortColumn = filter.get('sortColumn')
    const sortDirection = filter.get('sortDirection')

    return entities.sort((prev, next) => {
      const prevValue = prev.get(sortColumn)
      const nextValue = next.get(sortColumn)

      if (prevValue instanceof moment) {
        return EntitiesUtils._sortTimeValue(prevValue, nextValue, sortDirection)
      } else {
        return EntitiesUtils._sortValue(prevValue, nextValue, sortDirection)
      }
    })
  }

  static _sortTimeValue(prevValue, nextValue, sortDirection) {
    if (prevValue.isBefore(nextValue)) {
      return EntitiesUtils._sortOrder(sortDirection, false)
    } else if (prevValue.isAfter(nextValue)) {
      return EntitiesUtils._sortOrder(sortDirection)
    } else {
      return 0
    }
  }

  static _sortValue(prevValue, nextValue, sortDirection) {
    if (prevValue < nextValue) {
      return EntitiesUtils._sortOrder(sortDirection, false)
    } else if (prevValue > nextValue) {
      return EntitiesUtils._sortOrder(sortDirection)
    } else {
      return 0
    }
  }

  static _sortOrder(sortDirection, prev = true) {
    const isDesc = EntitiesUtils._isDesc(sortDirection)
    if (prev) {
      return isDesc ? -1 : 1
    } else {
      return isDesc ? 1 : -1
    }
  }

  static _isDesc(sortDirection) {
    return Boolean(sortDirection === 'DESC')
  }
}
