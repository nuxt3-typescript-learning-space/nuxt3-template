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
