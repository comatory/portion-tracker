export default class LoginActions {
  loginUser(userName, password) {
    return { userName, password }
  }

  logoutUser() {
    return {}
  }
}
