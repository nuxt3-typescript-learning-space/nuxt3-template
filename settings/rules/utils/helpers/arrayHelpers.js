/**
 * @typedef {import('estree').Property} Property
 */

/**
 * 配列にアイテムを追加するヘルパー関数
 * @param {string[]} list - 追加先のリスト
 * @param {string[]} items - 追加するアイテムのリスト
 */
export function addToList(list, items) {
  list.push(...items);
}

/**
 * プロパティから有効な名前を抽出しリストに追加するヘルパー関数
 * @param {Property[]} properties - オブジェクトプロパティの配列
 * @returns {string[]} - プロパティ名のリスト
 */
export function extractPropertyNames(properties) {
  return properties.reduce((acc, property) => {
    if (property.value?.name) {
      acc.push(property.value.name);
    }
    return acc;
  }, []);
}
