/**
 * リストに要素を追加する関数
 * @param {string[]} items - 追加する要素の配列
 * @param {string[]} list - 追加先のリスト
 * @returns {string[]}
 */
export function addToList(items: string[], list: string[]): string[] {
  return [...list, ...items];
}
