import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'react-toolbox/lib/dialog'
import {
  Button,
} from 'react-toolbox/lib'

import Login from '../components/login'

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
    let content = null
    const errorMessage = this.props.response && this.props.response.error ?
      this.props.response.error.message || JSON.stringify(this.props.response.error.stack) :
      ''

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
