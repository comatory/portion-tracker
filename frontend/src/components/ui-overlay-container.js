import React from 'react'
import PropTypes from 'prop-types'
import { Map } from 'immutable'

export default class UiOverlayContainer extends React.PureComponent {
  static contextTypes = {
    uiStore: PropTypes.object.isRequired,
  }

  state = this._getState()

  componentWillMount() {
    this.context.uiStore.listen(this._handleUiStoreChange)
  }

  componentWillUnmount() {
    this.context.uiStore.unlisten(this._handleUiStoreChange)
  }

  _getState() {
    const state = this.context.uiStore.getState()
    return {
      uiItems: state.get('uiItems') || Map(),
    }
  }

  _handleUiStoreChange = () => {
    this.setState(this._getState())
  }

  render() {
    const uiItems = this.state.uiItems.toArray()
    return (
      <div>
        { uiItems.map((uiItem) => {
          return uiItem
        })}
      </div>
    )
  }
}