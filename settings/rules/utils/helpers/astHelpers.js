/**
 * @typedef {import('estree').Node} Node
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 */

/**
 * ノードの祖先を探索し、指定されたタイプのノードを見つける
 * @param {Node} node - 開始ノード
 * @param {string} type - 探索するノードのタイプ
 * @returns {Node} - 見つかったノード
 */
export function findAncestorOfType(node, type) {
  let ancestor = node.parent;
  while (ancestor && ancestor.type !== type) {
    ancestor = ancestor.parent;
  }
  return ancestor;
}

/**
 * 特定関数呼び出しかどうかをチェックするヘルパー関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[] | RegExp} functions - チェックする関数名のリストまたはパターン
 * @returns {boolean} - 関数呼び出しかどうか
 */
export function isSpecificFunctionCall(node, functions) {
  if (node.init?.type !== 'CallExpression') return false;
  const functionName = node.init?.callee?.name;
  return Array.isArray(functions) ? functions.includes(functionName) : functions.test(functionName);
}

/**
 * storeToRefs関数の呼び出しかどうかをチェックするヘルパー関数
 * @param {VariableDeclarator} node - チェックするASTノード
 * @returns {boolean} - storeToRefs関数の呼び出しかどうか
 */
export function isStoreToRefsCall(node) {
  return (
    node.id.type === 'ObjectPattern' &&
    node.init &&
    node.init.type === 'CallExpression' &&
    node.init.callee.name === 'storeToRefs'
  );
}

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
