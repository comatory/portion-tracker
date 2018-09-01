import { Map, List } from 'immutable'

import Store from './store'
import TableIndex from '../indices/table-index';
import EntitiesUtils from '../utils/entities-utils'

export default class ActivityStore extends Store {
  constructor(services) {
    super(services)
    this.exportPublicMethods({
      getUserActivities: this.getUserActivities,
      getUserActivitiesPortions: this.getUserActivitiesPortions,
    })

    this._activityActions = services.activityActions
    this._userActions = services.userActions
    this._loginActions = services.loginActions

    this.bindListeners({
      handleSetUserActivities: this._activityActions.SET_USER_ACTIVITIES,
      handleSetUserActivitiesPortions: this._activityActions.SET_USER_ACTIVITIES_PORTIONS,
      handleSetUserInfo: this._userActions.SET_USER_INFO,
      handleLogout: this._loginActions.LOGOUT_USER,
    })

    this._state = Map({
      tableIndex: new TableIndex(),
    })
  }

  _getUserId() {
    const userInfo = this._state.get('userInfo')
    const userId = userInfo ? userInfo.get('id') : null
    return userId
  }

  handleSetUserActivities(userActivities) {
    const userId = this._getUserId()
    const activities = userActivities
    this._state = this._state.setIn([ 'userActivities', userId ], activities)
  }

  handleSetUserActivitiesPortions({ userActivitiesPortions, filterId }) {
    this._updateUserActivitiesPortions(userActivitiesPortions)
    this._updateIndex(filterId, userActivitiesPortions.map((a) => a.get('id')))
  }

  _updateUserActivitiesPortions(userActivitiesPortions) {
    const userId = this._getUserId()
    let existingActivitiesPortions = this._state.getIn([ 'userActivitiesPortions', userId ]) || List()

    userActivitiesPortions.forEach((portion) => {
      const index = existingActivitiesPortions.findIndex((existingPortion) => {
        return existingPortion.get('id') === portion.get('id')
      })

      if (index !== -1) {
        existingActivitiesPortions = existingActivitiesPortions.set(index, portion)
      } else {
        existingActivitiesPortions = existingActivitiesPortions.push(portion)
      }
    })

    this._state = this._state.setIn([ 'userActivitiesPortions', userId ], existingActivitiesPortions)
  }

  handleSetUserInfo(userInfo) {
    this._state = this._state.set('userInfo', userInfo)
  }

  handleLogout() {
    this._state = this._state.set('userInfo', null)
  }

  getUserActivities = () => {
    const userId = this._getUserId()

    if (!userId) {
      return Map()
    }

    const userActivities = this._state.getIn([ 'userActivities', userId ]) || Map()
    return userActivities
  }

  getUserActivitiesPortions = (filter) => {
    const userActivitiesPortions = this._getAllUserActivitiesPortions()
    const id = filter.getId()
    const indices = this._state.get('tableIndex').getPaginationIndex(id) || List()

    const filteredActivitiesPortions = userActivitiesPortions.filter((portion) => {
      return indices.includes(portion.get('id'))
    })

    const sortedActivitiesPortions = EntitiesUtils.sortEntities(filteredActivitiesPortions, filter)

    return sortedActivitiesPortions
  }

  _getAllUserActivitiesPortions() {
    const userId = this._getUserId()

    if (!userId) {
      return Map()
    }

    const userActivitiesPortions = this._state.getIn([ 'userActivitiesPortions', userId ]) || Map()
    return userActivitiesPortions
  }

  _updateIndex = (id, indices) => {
    this._state.get('tableIndex').setPaginationIndex(id, indices)
  }
}
