import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'react-toolbox/lib/dialog'
import {
  Button,
} from 'react-toolbox/lib'

import Login from '../components/login'
import VerificationForm from '../components/verification-form'

export default class ErrorOverlay extends React.PureComponent {
  static contextTypes = {
    requestManager: PropTypes.object.isRequired,
    userStore: PropTypes.object.isRequired,
    uiManager: PropTypes.object.isRequired,
  }

  state = this._getState()

  componentWillMount() {
    this.context.userStore.listen(this._handleUserStoreChange)
  }

  componentWillUnmount () {
    this.context.userStore.unlisten(this._handleUserStoreChange)
  }

  _getState() {
    const state = this.context.userStore.getState()
    const userInfo = state.get('userInfo')

    return {
      userInfo,
    }
  }

  _handleUserStoreChange = () => {
    this.setState(this._getState())
  }

  _handleClearOverlayitem = () => {
    this.context.uiManager.hideErrorOverlay(this.props.id)
  }

  _handleDismiss = () => {
    this._handleClearOverlayitem()
  }

  _handleRetry = () => {
    this.context.uiManager.hideErrorOverlay(this.props.id)
    this.context.requestManager.retryRequest(this.props.actionName)
  }

  render() {
    const response = this.props.response || {}
    let content = null
    const errorMessage = response.error ?
      response.error.message || JSON.stringify(response.error.stack) :
      ''
    const userVerified = response && response.userVerified !== null ?
      Boolean(response.userVerified) :
      true

    switch (this.props.status) {
      case 403:
        content = (
          <div>
            <h2>Warning!</h2>
            { this.state.userInfo &&
              <Button onClick={this._handleClearOverlayitem}>Go back</Button>
            }
            { !this.state.userInfo && <Login afterLoginRequest={this._handleClearOverlayitem} /> }
          </div>
        )
        break

      case 500:
      case 422:
        content = (
          <div>
            <h2>Error!</h2>
            <sub>{this.props.actionName}</sub>
            <div>
              {errorMessage && <pre style={{ overflow: 'auto' }}>{errorMessage}</pre>}
            </div>
            <div>
              { this.state.userInfo && !this.props.errorActions &&
                <Button onClick={this._handleClearOverlayitem}>Go back</Button>
              }
              { this.props.errorActions &&
                <React.Fragment>
                  { this.props.errorActions.dismiss &&
                    <Button onClick={this._handleDismiss}>Dismiss</Button>
                  }
                  { this.props.errorActions.retry &&
                    <Button onClick={this._handleRetry}>Retry</Button>
                  }
                </React.Fragment>
              }
            </div>
          </div>
        )
        break
    }

    const message = this.props.response.body && this.props.response.body.message

    if (!userVerified) {
      content = <VerificationForm />
    }

    return (
      <div>
        <Dialog
          active
        >
          { message &&
            <div>
              { message }
            </div>
          }
          { content }
        </Dialog>
      </div>
    )
  }
}
