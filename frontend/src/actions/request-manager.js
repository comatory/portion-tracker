import Manager from './manager'
import ApiUtils from '../utils/api-utils'
import Request from '../entities/request'

export default class RequestManager extends Manager {
  constructor(services) {
    super(services)
    this._uiManager = services.uiManager
    this._requestActions = services.requestActions
    this._requestStore = services.requestStore
  }

  _createRequest(url, options) {
    return fetch(url, options)
  }

  async get(actionName, url, options = {}) {
    this._dispatchAddRequestAction('GET', actionName, url, options)

    const result = await this._createRequest(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const normalized = await ApiUtils.normalizeBody(result)

    if (normalized.error) {
      const showErrorOverlay = options.showErrorOverlay || true
      if (showErrorOverlay) {
        this._uiManager.showErrorOverlay(normalized, actionName, options.errorActions)
      }
      this._dispatchRequestError(actionName, normalized.error)
      return Promise.reject(normalized.error)
    }

    this._dispatchRemoveRequestAction(actionName)
    return Promise.resolve(normalized)
  }

  delete(url) {

  }

  async post(actionName, url, options = {}) {
    this._dispatchAddRequestAction('POST', actionName, url, options)

    const result = await this._createRequest(url, {
      body: JSON.stringify(options.data),
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const normalized = await ApiUtils.normalizeBody(result)

    if (normalized.error) {
      const showErrorOverlay = options.showErrorOverlay || true
      if (showErrorOverlay) {
        this._uiManager.showErrorOverlay(normalized, actionName, options.errorActions)
      }
      this._dispatchRequestError(actionName, normalized.error)
      return Promise.reject(normalized.error)
    }

    this._dispatchRemoveRequestAction(actionName)
    return Promise.resolve(normalized)
  }

  addRequest(method, actionName, requestUrl, options = {}) {
    this._dispatchAddRequestAction(method, actionName, requestUrl, options)
  }

  removeRequest(actionName) {
    this._dispatchRemoveRequestAction(actionName)
  }

  setRequestError(actionName, error) {
    this._dispatchRequestError(actionName, error)
  }

  _dispatchAddRequestAction(method, actionName, requestUrl, options = {}) {
    const { data, ...restOptions } = options

    const request = Request.fromData({
      'id': actionName,
      'method': method,
      'requestUrl': requestUrl,
      'payload': data,
      'options': restOptions,
    })

    setImmediate(() => {
      this._requestActions.addRequest(actionName, request)
    })
  }

  _dispatchRemoveRequestAction(actionName) {
    setImmediate(() => {
      this._requestActions.removeRequest(actionName)
    })
  }

  _dispatchRequestError(actionName, error) {
    setImmediate(() => {
      this._requestActions.setRequestError(actionName, error)
    })
  }

  retryRequest(actionName) {
    const request = this._requestStore.getRequest(actionName)

    if (!request) {
      console.error('Unable to find request!')
    }
    const normalizedMethod = request.get('method').toLowerCase()

    this[normalizedMethod](
      actionName,
      request.get('requestUrl'),
      {
        data: request.get('payload'),
        ...request.get('options'),
      },
    )
  }
}
