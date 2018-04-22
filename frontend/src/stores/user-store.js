import Store from './store'

import UserInfo from '../entities/user-info'

export default class UserStore extends Store {
  constructor(services) {
    super(services)
    this._loginActions = services.loginActions
    this._userActions = services.userActions
    this.bindListeners({
      handleLoginUser: this._loginActions.LOGIN_USER,
      handleLogoutUser: this._loginActions.LOGOUT_USER,
      handleSetUserInfo: this._userActions.SET_USER_INFO,
    })
  }

  handleLoginUser(userData) {
    this._state = this._state.set('userInfo', UserInfo.fromData(userData))
  }

  handleLogoutUser() {
    this._state = this._state.set('userInfo', null)
  }

  handleSetUserInfo(userInfo) {
    this._state = this._state.set('userInfo', userInfo)
  }
}
