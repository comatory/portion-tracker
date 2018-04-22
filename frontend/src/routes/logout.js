import React from 'react'
import {
  HashRouter as Router,
  Redirect,
} from 'react-router-dom'
import PropTypes from 'prop-types'

import { API_IDS } from '../actions/constants'

export default class Logout extends React.PureComponent {
  static contextTypes = {
    apiManager: PropTypes.object.isRequired,
    requestStore: PropTypes.object.isRequired,
  }

  state = this._getState()

  componentDidMount() {
    if (this.props.mountCallback) {
      this.props.mountCallback()
    }
    this.context.requestStore.listen(this._handleRequestStoreChange)
    this.context.apiManager.logout()
  }

  componentWillUnmount() {
    this.context.requestStore.unlisten(this._handleRequestStoreChange)
  }

  _handleRequestStoreChange = () => {
    this.setState((nextState) => {
      const logoutState = this._getLogoutState()
      return {
        ...logoutState,
        loggedOut: Boolean(logoutState.logoutReq && !nextState.logoutReq),
      }
    })
  }

  _getState() {
    return {
      ...this._getLogoutState(),
      loggedOut: false,
    }
  }

  _getLogoutState() {
    const logoutReq = this.context.requestStore.getRequest(
      API_IDS.LOGIN_IDS.LOGIN_IDS_LOGOUT
    )

    return {
      logoutReq,
    }
  }

  _redirect() {
  }

  render () {
    return (
      <div>
        {this.state.logoutReq && !this.state.logoutReq.get('error') && <p>Logging out... </p>}
        {!this.state.logoutReq && <p>You have been succesfully logged out</p>}
        {this.state.loggedOut && 
          <Router>
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          </Router>
        }
      </div>
    )
  }
}