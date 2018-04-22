import { ioc } from '@adonisjs/fold'
import Alt from 'alt'

import {
  ActivityActions,
  ConfigActions,
  EnumerationActions,
  FormActions,
  LoginActions,
  UserActions,
  RequestActions,
  UiActions,

  ApiManager,
  FormManager,
  RequestManager,
  UiManager,
} from '../actions'
import {
  ActivityStore,
  ConfigStore,
  EnumerationStore,
  FormStore,
  RequestStore,
  UserStore,
  UiStore,
} from '../stores'

const alt = new Alt()

ioc.singleton('Alt', (app) => {
  return alt
})

ioc.singleton('ActivityActions', (app) => {
  return alt.createActions(ActivityActions)
})

ioc.singleton('LoginActions', (app) => {
  return alt.createActions(LoginActions)
})

ioc.singleton('ConfigActions', (app) => {
  return alt.createActions(ConfigActions)
})

ioc.singleton('EnumerationActions', (app) => {
  return alt.createActions(EnumerationActions)
})

ioc.singleton('FormActions', (app) => {
  return alt.createActions(FormActions)
})

ioc.singleton('RequestActions', (app) => {
  return alt.createActions(RequestActions)
})

ioc.singleton('UserActions', (app) => {
  return alt.createActions(UserActions)
})

ioc.singleton('UiActions', (app) => {
  return alt.createActions(UiActions)
})

ioc.singleton('ActivityStore', (app) => {
  return alt.createStore(ActivityStore, 'ActivityStore', {
    activityActions: ioc.use('ActivityActions'),
    userActions: ioc.use('UserActions'),
    loginActions: ioc.use('LoginActions'),
  })
})

ioc.singleton('ConfigStore', (app) => {
  return alt.createStore(ConfigStore, 'ConfigStore', {
    configActions: ioc.use('ConfigActions'),
  })
})

ioc.singleton('EnumerationStore', (app) => {
  return alt.createStore(EnumerationStore, 'EnumerationStore', {
    enumerationActions: ioc.use('EnumerationActions'),
  })
})

ioc.singleton('FormStore', (app) => {
  return alt.createStore(FormStore, 'FormStore', {
    formActions: ioc.use('FormActions'),
  })
})

ioc.singleton('RequestStore', (app) => {
  return alt.createStore(RequestStore, 'RequestStore', {
    requestActions: ioc.use('RequestActions'),
  })
})

ioc.singleton('UserStore', (app) => {
  return alt.createStore(UserStore, 'UserStore', {
    loginActions: ioc.use('LoginActions'),
    userActions: ioc.use('UserActions'),
  })
})

ioc.singleton('UiStore', (app) => {
  return alt.createStore(UiStore, 'UiStore', {
    uiActions: ioc.use('UiActions'),
  })
})

ioc.singleton('FormManager', (app) => {
  return new FormManager({
    formActions: ioc.use('FormActions'),
    apiManager: ioc.use('ApiManager'),
  })
})

ioc.singleton('RequestManager', (app) => {
  return new RequestManager({
    uiManager: ioc.use('UiManager'),
    requestActions: ioc.use('RequestActions'),
    requestStore: ioc.use('RequestStore'),
  })
})

ioc.singleton('ApiManager', (app, a, b) => {
  return new ApiManager({
    activityActions: ioc.use('ActivityActions'),
    configStore: ioc.use('ConfigStore'),
    enumerationActions: ioc.use('EnumerationActions'),
    loginActions: ioc.use('LoginActions'),
    requestManager: ioc.use('RequestManager'),
    userActions: ioc.use('UserActions'),
    userStore: ioc.use('UserStore'),
    uiActions: ioc.use('UiActions'),
    uiManager: ioc.use('UiManager'),
  })
})

ioc.singleton('UiManager', (app) => {
  return new UiManager({
    uiActions: ioc.use('UiActions'),
  })
})

const services = {
  managers: {
    apiManager: ioc.use('ApiManager'),
    formManager: ioc.use('FormManager'),
    requestManager: ioc.use('RequestManager'),
    uiManager: ioc.use('UiManager'),
  },
  actions: {
    activityActions: ioc.use('ActivityActions'),
    configActions: ioc.use('ConfigActions'),
    enumerationActions: ioc.use('EnumerationActions'),
    formActions: ioc.use('FormActions'),
    loginActions: ioc.use('LoginActions'),
    requestActions: ioc.use('RequestActions'),
    userActions: ioc.use('UserActions'),
    uiActions: ioc.use('UiActions'),
  },
  stores: {
    activityStore: ioc.use('ActivityStore'),
    configStore: ioc.use('ConfigStore'),
    enumerationStore: ioc.use('EnumerationStore'),
    formStore: ioc.use('FormStore'),
    requestStore: ioc.use('RequestStore'),
    userStore: ioc.use('UserStore'),
    uiStore: ioc.use('UiStore'),
  },
  services: {
    alt: ioc.use('Alt'),
  },
}

export default services
