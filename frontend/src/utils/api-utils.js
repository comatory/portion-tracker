import { List } from 'immutable'

export default class ApiUtils {
  static async normalizeBody(response) {
    const json = await response.json()
    const verifiedHeader = response.headers.get('X-User-Verified')

    let baseResponse = {
      body: json,
      status: response.status,
      userVerified: verifiedHeader ? Boolean(JSON.parse(verifiedHeader)) : null,
    }

    if (response.status !== 200) {
      baseResponse = {
        ...baseResponse,
        error: new Error(json.message),
      }
    }

    return baseResponse
  }

  static normalizeActivityFormData(values, userInfo) {
    const portions = values.reduce((acc, portion) => {
      return acc.push({
        PortionHealthinessId: portion.get('portionHealthinessId'),
        PortionSizeId: portion.get('portionSizeId'),
        calories: portion.get('calories'),
        note: portion.get('note'),
      })
    }, List())

    return {
      UserId: userInfo.get('id'),
      Portions: portions.toArray(),
    }
  }

  static normalizePortionFormData(portion, userInfo) {
    return {
      PortionHealthinessId: portion.get('portionHealthinessId'),
      PortionSizeId: portion.get('portionSizeId'),
      calories: portion.get('calories') || null,
      note: portion.get('note') || '',
    }
  }
}
