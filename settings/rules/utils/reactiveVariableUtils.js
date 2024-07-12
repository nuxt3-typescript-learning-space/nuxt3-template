import { addToList, extractPropertyNames } from './helpers/arrayHelpers.js';

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
  const args = node.params.reduce((acc, param) => {
    if (param.name) {
      acc.push(param.name);
    }
    return acc;
  }, []);
  addToList(list, args);
}

/**
 * composables関数の引数をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 引数リスト
 * @param {RegExp} composableFunctionPattern - composables関数名のパターン
 */
export function addToComposablesArgumentsList(node, list, composableFunctionPattern) {
  const isComposableCall =
    node.init?.type === 'CallExpression' && composableFunctionPattern.test(node.init?.callee?.name);
  if (isComposableCall && node.id.type === 'ObjectPattern') {
    const properties = extractPropertyNames(node.id.properties);
    addToList(list, properties);
  }
}

/**
 * リアクティブな関数呼び出しかどうかをチェックするヘルパー関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} reactiveFunctions - リアクティブな関数名のリスト
 * @returns {boolean} - リアクティブ関数呼び出しかどうか
 */
export function isReactiveCall(node, reactiveFunctions) {
  return node.init?.type === 'CallExpression' && reactiveFunctions.includes(node.init?.callee?.name);
}

/**
 * リアクティブな識別子をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 変数名リスト
 */
function addReactiveIdentifier(node, list) {
  if (node.id.type === 'Identifier') {
    addToList(list, [node.id.name]);
  }
}

/**
 * リアクティブなオブジェクトパターンをリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 変数名リスト
 */
function addReactiveObjectPattern(node, list) {
  if (node.id.type === 'ObjectPattern') {
    const properties = extractPropertyNames(node.id.properties);
    addToList(list, properties);
  }
}

/**
 * リアクティブ変数をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 変数名リスト
 * @param {string[]} reactiveFunctions - リアクティブな関数名のリスト
 */
export function addReactiveVariables(node, list, reactiveFunctions) {
  if (isReactiveCall(node, reactiveFunctions)) {
    addReactiveIdentifier(node, list);
    addReactiveObjectPattern(node, list);
  }
}
