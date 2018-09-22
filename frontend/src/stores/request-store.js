import Store from './store'

export default class ActivityStore extends Store {
  constructor(services) {
    super(services)

    this.exportPublicMethods({
      getRequest: this.getRequest,
      isRequestPending: this.isRequestPending,
    })

    this._requestActions = services.requestActions

    this.bindListeners({
      handleAddRequest: this._requestActions.ADD_REQUEST,
      handleRemoveRequest: this._requestActions.REMOVE_REQUEST,
      handleSetRequestError: this._requestActions.SET_REQUEST_ERROR,
    })
  }

  handleAddRequest({ requestId, request }) {
    this._state = this._state.set(requestId, request)
  }

  handleRemoveRequest({ requestId }) {
    this._state = this._state.delete(requestId)
  }

  handleSetRequestError({ requestId, error }) {
    let request = this._state.get(requestId)

    request = request.set('error', error)

    this._state = this._state.set(requestId, request)
  }

  getRequest = (requestId) => {
    return this._state.get(requestId) || null
  }

  isRequestPending = () => {
    const requestCount = this._state.count()

    const hasErrors = this._state.some((req) => {
      return Boolean(req.get('error'))
    })

    return Boolean(requestCount > 0 && !hasErrors)
  }
}
