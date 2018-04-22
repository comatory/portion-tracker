import React from 'react'
import hat from 'hat'

import Manager from './manager'
import ErrorOverlay from '../components/error-overlay'

export default class UiManager extends Manager {
  constructor(services) {
    super(services)
    this._uiActions = services.uiActions
  }

  showErrorOverlay(response, actionName, errorActions) {
    const id = hat()
    const item = (
      <ErrorOverlay
        key={id}
        id={id}
        actionName={actionName}
        response={response}
        status={response.status}
        errorActions={errorActions}
      />
    )

    this._uiActions.registerUiItem(id, item)
  }

  hideErrorOverlay(id) {
    this._uiActions.unregisterUiItem(id)
  }
}
