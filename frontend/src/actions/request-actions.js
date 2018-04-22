export default class RequestActions {
  addRequest(requestId, request) {
    return { requestId, request }
  }

  setRequestError(requestId, error) {
    return { requestId, error }
  }

  removeRequest(requestId) {
    return { requestId }
  }
}
