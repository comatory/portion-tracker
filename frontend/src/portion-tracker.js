import ReactDOM from 'react-dom'
import React from 'react'

import App from './components/app'
import './styles/global.css'

export default class PortionTracker {
  constructor(services) {
    this._services = {}
    this._services.stores = services.stores
    this._services.managers = services.managers
    this._configActions = services.actions.configActions
    this._alt = services.services.alt

    const portionTracker = {
      services,
    }

    global.portionTracker = portionTracker
  }

  init() {
    // NOTE: Display dispatched actions in console
    this._alt.dispatcher.register(console.log.bind(console))

    Object.keys(this._services.stores).forEach((store) => {
      this._services.stores[store].register(this._services)
    })

    Object.keys(this._services.managers).forEach((manager) => {
      this._services.managers[manager].register(this._services)
    })

    this._configActions.setApiUrl(process.env.BE_URL || '')
  }

  destroy() {
    Object.keys(this._services.stores).forEach((store) => {
      this._services.stores[store].unregister(this._services)
    })

    Object.keys(this._services.managers).forEach((manager) => {
      this._services.managers[manager].unregister(this._services)
    })
  }

  _handleUnmount = () => {
    this.destroy()
  }

  render() {
    ReactDOM.render(
      <App onUnmount={this._handleUnmount} />,
      document.getElementById('app')
    )
  }
}
