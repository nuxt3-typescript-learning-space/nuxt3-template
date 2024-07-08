/**
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 * @typedef {import('estree').FunctionDeclaration} FunctionDeclaration
 * @typedef {import('estree').ArrowFunctionExpression} ArrowFunctionExpression
 */

/**
 * 関数の引数をリストに追加する関数
 * @param {FunctionDeclaration | ArrowFunctionExpression} node - ASTのノード
 * @param {string[]} list - 引数のリスト
 */
export function addArgumentsToList(node, list) {
  if (node.params.length > 0) {
    list.push(...node.params.map((param) => param.name).filter(Boolean));
  }
}

/**
 * リアクティブな変数をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 変数名リスト
 * @param {string[]} reactiveFunctions - リアクティブな関数名のリスト
 */
export function addReactiveVariables(node, list, reactiveFunctions) {
  const isReactiveCall = node.init?.type === 'CallExpression' && reactiveFunctions.includes(node.init?.callee?.name);
  if (isReactiveCall && node.id.type === 'Identifier') {
    list.push(node.id.name);
  }
}

/**
 * 変数の初期値がリアクティブ関数から取得する場合、その変数名をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 変数名リスト
 * @param {string[]} reactiveFunctions - リアクティブな関数名のリスト
 */
export function addToVariablesListFromCalleeWithArgument(node, list, reactiveFunctions) {
  const isReactiveCall = node.init?.type === 'CallExpression' && reactiveFunctions.includes(node.init?.callee?.name);
  if (isReactiveCall && node.id.type === 'ObjectPattern') {
    list.push(...node.id.properties.map((property) => property.value.name).filter(Boolean));
  }
}
