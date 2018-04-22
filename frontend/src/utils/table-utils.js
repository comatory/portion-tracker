export default class TableUtils {
  static mapIdToName(enumeration, id) {
    const item = enumeration.find((enumItem) => {
      return enumItem.get('value') === id
    })

    return item ? item.name : ''
  }
}
