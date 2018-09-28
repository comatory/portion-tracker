export default class FormUtils {
  static extractOptionsForSelect(item, value, label) {
    return {
      value: item.get(value),
      label: item.get(label),
    }
  }
}
