/**
 * @typedef {import('estree').Node} Node
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 */

/**
 * ノードの祖先を探索し、指定されたタイプのノードを見つける
 * @param {Node} node - 開始ノード
 * @param {string} type - 探索するノードのタイプ
 * @returns {Node | null} - 見つかったノード、またはnull
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
