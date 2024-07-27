/**
 * 変数名がstateリストに含まれていて、接尾辞が "State" で終わっていないかをチェックするヘルパー関数
 * @param {string} originalName - 元の変数名
 * @param {string} nameToCheck - チェックする変数名
 * @param {string[]} stateList - stateのリスト
 * @returns {boolean} - 変数名が状態リストに含まれていて、接尾辞が "State" で終わっていない場合は true
 */
export function hasStateNameWithoutStateSuffix(originalName, nameToCheck, stateList) {
  return stateList.includes(originalName) && !nameToCheck.endsWith('State');
}

/**
 * プロパティがgettersListに含まれるか確認し 、別名が設定されているかどうかをチェックするヘルパー関数
 * @param {string} originalName - 元のプロパティ名
 * @param {string} aliasName - 別名
 * @param {string[]} gettersList - gettersのリスト
 * @returns {boolean} - プロパティがgettersのリストに含まれていて、別名が設定されている場合は true
 */
export function isGetterAliasPresent(originalName, aliasName, gettersList) {
  return gettersList.includes(originalName) && !!aliasName && originalName !== aliasName;
}
