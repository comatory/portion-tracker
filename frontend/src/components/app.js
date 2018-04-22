import React from 'react'
import PropTypes from 'prop-types'

import Login from './login'

import services from '../services'
import stores from '../stores'

import AppContainer from './app-container'

import '../styles/app.css'

export default class App extends React.PureComponent {

  static childContextTypes = {
    alt: PropTypes.object.isRequired,

    apiManager: PropTypes.object.isRequired,
    formManager: PropTypes.object.isRequired,
    requestManager: PropTypes.object.isRequired,
    uiManager: PropTypes.object.isRequired,

    activityActions: PropTypes.object.isRequired,
    configActions: PropTypes.object.isRequired,
    enumerationActions: PropTypes.object.isRequired,
    formActions: PropTypes.object.isRequired,
    loginActions: PropTypes.object.isRequired,
    requestActions: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired,
    uiActions: PropTypes.object.isRequired,

    activityStore: PropTypes.object.isRequired,
    configStore: PropTypes.object.isRequired,
    enumerationStore: PropTypes.object.isRequired,
    formStore: PropTypes.object.isRequired,
    requestStore: PropTypes.object.isRequired,
    userStore: PropTypes.object.isRequired,
    uiStore: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      ...services.services,
      ...services.actions,
      ...services.stores,
      ...services.managers,
    } 
  }


  componentWillUnmount() {
    this.props.onUnmount()
  }

  render() {
    return (
      <React.Fragment>
        <AppContainer />
      </React.Fragment>
    )
  }
}
