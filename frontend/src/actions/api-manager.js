import { List, Set } from 'immutable'

import Manager from './manager'

import {
  Enumeration,
  UserInfo,
  UserActivities,
  Portion,
  TableFilter,
} from '../entities'
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
      `${this.baseUrl}/api/sessions/login`,
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
      `${this.baseUrl}/api/sessions/logout`
    )
      .then((response) => {
        this._loginActions.logoutUser()
      })
      .catch((error) => {
        this._requestManager.setRequestError(API_IDS.LOGIN_IDS.LOGIN_IDS_LOGOUT, error)
        console.log(error)
      })
  }

  registerUser(data) {
    this._requestManager.post(
      API_IDS.REGISTER_IDS.REGISTER_IDS_REGISTER,
      `${this.baseUrl}/api/registration`, {
        data,
        errorActions: {
          dismiss: true,
        },
      },
    )
      .then((response) => {
        this._requestManager.removeRequest(API_IDS.REGISTER_IDS.REGISTER_IDS_REGISTER)
      })
      .catch((error) => {
        this._requestManager.setRequestError(API_IDS.REGISTER_IDS.REGISTER_IDS_REGISTER, error)
        console.log(error)
      })
  }

  verifyUser(data) {
    this._requestManager.post(
      API_IDS.REGISTER_IDS.REGISTER_IDS_VERIFY_USER_EMAIL,
      `${this.baseUrl}/api/registration/verify`,
      { data }
    )
      .then((response) => {
        this._uiManager.reloadApp()
      })
      .catch((error) => {
        this._requestManager.setRequestError(API_IDS.REGISTER_IDS.REGISTER_IDS_VERIFY_USER_EMAIL, error)
        console.log(error)
      })
  }

  loadRequiredAppData(userInfo) {
    const userId = userInfo.get('id')

    Promise.all([
      this.getPortionHealthinesses(userId),
      this.getPortionSizes(userId),
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
    const sortDirection = filter.get('sortDirection')

    if (!userId) {
      return
    }

    this._requestManager.get(
      API_IDS.ACTIVITY_IDS.ACTIVITY_IDS_GET_USER_ACTIVITIES_PORTIONS,
      `${this.baseUrl}/api/users/${userId}/portions?page=${page}&limit=${limit}&sortBy=${sortColumn}&sortDir=${sortDirection}`
    )
      .then((response) => {
        const result = response.body.result || response.body
        const { page, pages, sortBy, sortDir } = response.body
        const userActivitesPortions = result.length > 0 ?
          List(result.map((r) => {
            return Portion.fromData(r)
          })) :
          Portion.fromData(result)

        const updatedFilter = filter.merge({
          'page': page,
          'pages': pages,
          'sortColumn': sortBy,
          'sortDirection': sortDir,
          'selectedRows': Set(),
        })

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
    }).catch((error) => {
      console.log(error)
    })
  }

  updateActivityPortion(portionId, data) {
    this._requestManager.put(
      API_IDS.ACTIVITY_IDS.ACTIVITY_IDS_UPDATE_ACTIVITY_PORTION,
      `${this.baseUrl}/api/portions/${portionId}`,
      {
        data,
        errorActions: {
          dismiss: true,
          retry: true,
        },
      }
    ).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })
  }

  deleteActivityPortions(data) {
    this._requestManager.delete(
      API_IDS.ACTIVITY_IDS.ACTIVITY_IDS_DELETE_ACTIVITY_PORTIONS,
      `${this.baseUrl}/api/portions/`,
      {
        data,
        errorActions: {
          dismiss: true,
          retry: true,
        },
      }
    ).then((response) => {
      this._activityActions.removeActivityPortion(data.ids)
      console.log(response)
    }).catch((error) => {
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
