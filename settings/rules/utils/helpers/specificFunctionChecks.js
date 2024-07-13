/**
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 */

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
