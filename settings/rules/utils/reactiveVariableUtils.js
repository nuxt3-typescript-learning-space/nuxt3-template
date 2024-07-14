import { addToList, extractPropertyNames } from './helpers/arrayHelpers.js';
import { isSpecificFunctionCall } from './helpers/specificFunctionChecks.js';

/**
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 * @typedef {import('estree').FunctionDeclaration} FunctionDeclaration
 * @typedef {import('estree').ArrowFunctionExpression} ArrowFunctionExpression
 */

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
 * @param {string[] | RegExp} reactiveFunctions - リアクティブな関数名のリストまたはパターン
 */
export function addReactiveVariables(node, list, reactiveFunctions) {
  if (isSpecificFunctionCall(node, reactiveFunctions)) {
    addReactiveIdentifier(node, list);
    addReactiveObjectPattern(node, list);
  }
}

/**
 * composables関数の引数をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 引数リスト
 * @param {RegExp} composableFunctionPattern - composables関数名のパターン
 */
export function addComposablesArgumentsToList(node, list, composableFunctionPattern) {
  if (isSpecificFunctionCall(node, composableFunctionPattern) && node.id.type === 'ObjectPattern') {
    const properties = extractPropertyNames(node.id.properties);
    addToList(list, properties);
  }
}

/**
 * スキップする関数の引数をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 引数リスト
 * @param {string[]} skipFunctions - スキップする関数名のリスト
 */
export function addSkipCheckFunctionsArgumentsToList(node, list, skipFunctions) {
  if (isSpecificFunctionCall(node, skipFunctions) && node.id.type === 'ObjectPattern') {
    const properties = extractPropertyNames(node.id.properties);
    addToList(list, properties);
  }
}

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
