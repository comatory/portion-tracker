import { List } from 'immutable'

import Manager from './manager'

import {
  Enumeration,
  UserInfo,
  UserActivities,
  Portion,
  TableFilter,
} from '../entities'
import ActivityContainer from '../components/portion-container';
import { API_IDS } from './constants'

export default class ApiManager extends Manager {
  baseUrl = null 
  userInfo = null

  constructor(services) {
    super(services)
    this._requestManager = services.requestManager
    this._loginActions = services.loginActions
    this._userActions = services.userActions
    this._enumerationActions = services.enumerationActions
    this._activityActions = services.activityActions
    this._configStore = services.configStore
    this._userStore = services.userStore
    this._uiActions = services.uiActions
    this._uiManager = services.uiManager
  }

  register() {
    this._configStore.listen(this._handleConfigStoreChange)
    this._userStore.listen(this._handleUserStoreChange)
  }

  unregister() {
    this._configStore.unlisten(this._handleConfigStoreChange)
    this._userStore.unlisten(this._handleUserStoreChange)
  }

  login(data) {
    this._requestManager.post(
      API_IDS.LOGIN_IDS.LOGIN_IDS_LOGIN,
      `${this.baseUrl}/login`,
      { data },
    )
      .then((response) => {
        const userInfo = UserInfo.fromData(response.body)
        this._requestManager.removeRequest(API_IDS.USER_IDS.USER_IDS_GET_USER_DATA)
        this._userActions.setUserInfo(userInfo)
      })
      .catch((error) => {
        this._requestManager.setRequestError(API_IDS.USER_IDS.USER_IDS_GET_USER_DATA, error)
        console.log(error)
      })
  }

  logout() {
    this._requestManager.post(
      API_IDS.LOGIN_IDS.LOGIN_IDS_LOGOUT,
      `${this.baseUrl}/logout`
    )
      .then((response) => {
        this._loginActions.logoutUser()
      })
      .catch((error) => {
        this._requestManager.setRequestError(API_IDS.LOGIN_IDS.LOGIN_IDS_LOGOUT, error)
        console.log(error)
      })
  }

  loadRequiredAppData(userInfo) {
    const userId = userInfo.get('id')

    Promise.all([
      this.getPortionHealthinesses(userId),
      this.getPortionSizes(userId)
    ])

  }

  getPortionHealthinesses(userId) {
    this._requestManager.get(
      API_IDS.ENUMERATION_IDS.ENUMERATION_IDS_GET_PORTION_HEALTHINESSES,
      `${this.baseUrl}/api/portion_healthinesses`
    )
      .then((response) => {
        const enumerations = List(
          response.body.map((enumeration) => {
            return Enumeration.fromData(enumeration)
          })
        ) 
        this._enumerationActions.setEnumeration(
          'portion-healthinesses',
          enumerations
        )
      })
      .catch((error) => {
        console.log(error)
        return error
      })
  }

  getPortionSizes(userId) {
    this._requestManager.get(
      API_IDS.ENUMERATION_IDS.ENUMERATION_IDS_GET_PORTION_SIZES,
      `${this.baseUrl}/api/portion_sizes`
    )
      .then((response) => {
        const enumerations = List(
          response.body.map((enumeration) => {
            return Enumeration.fromData(enumeration)
          })
        ) 
        this._enumerationActions.setEnumeration(
          'portion-sizes',
          enumerations
        )
      })
      .catch((error) => {
        console.log(error)
        return error
      })
  }

  getUserData() {
    this._requestManager.get(
      API_IDS.USER_IDS.USER_IDS_GET_USER_DATA,
      `${this.baseUrl}/api/users/current_user`
    )
      .then((response) => {
        const userInfo = UserInfo.fromData(response.body)
        this._userActions.setUserInfo(userInfo)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getUserActivities({ limit, page }) {
    const userId = this.userInfo ? this.userInfo.get('id') : null

    if (!userId) {
      return
    }

    this._requestManager.get(
      API_IDS.ACTIVITY_IDS.ACTIVITY_IDS_GET_USER_ACTIVITIES,
      `${this.baseUrl}/api/users/${userId}/activities`
    )
      .then((response) => {
        const result = response.body.result || response.body
        const userActivites = UserActivities.fromData(result)
        this._activityActions.setUserActivities(userActivites)

      })
      .catch((error) => {
        console.log(error)
      })
  }

  getUserActivitiesPortions(options) {
    const userId = this.userInfo ? this.userInfo.get('id') : null
    const filter = options.filter || new TableFilter() 
    const limit = filter.get('limit') 
    const page = options.page || 1
    const sortColumn = filter.get('sortColumn')

    if (!userId) {
      return
    }

    this._requestManager.get(
      API_IDS.ACTIVITY_IDS.ACTIVITY_IDS_GET_USER_ACTIVITIES_PORTIONS,
      `${this.baseUrl}/api/users/${userId}/portions?page=${page}&limit=${limit}&sortBy=${sortColumn}`
    )
      .then((response) => {
        const result = response.body.result || response.body
        const { page, pages } = response.body
        const userActivitesPortions = result.length > 0 ? 
        List(result.map((r) => {
          return Portion.fromData(r)
        })) :
        Portion.fromData(result)
        const updatedFilter = filter.set('page', page)
                                    .set('pages', pages)
        this._uiActions.setTableFilter(updatedFilter)
        this._activityActions.setUserActivitiesPortions(userActivitesPortions, updatedFilter.getId())
      })
      .catch((error) => {
        console.log(error)
      })
  }

  createNewActivity(data) {
    this._requestManager.post(
      API_IDS.ACTIVITY_IDS.ACTIVITY_IDS_CREATE_NEW_ACTIVITY,
      `${this.baseUrl}/api/activities`,
      {
        data,
        errorActions: {
          dismiss: true,
          retry: true,
        },
      }
    ).then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  _handleConfigStoreChange = () => {
    const configState = this._configStore.getState()
    this.baseUrl = configState.get('apiUrl')
  }

  _handleUserStoreChange = () => {
    const state = this._userStore.getState()
    this.userInfo = state.get('userInfo')
  }
}