import { findAncestorOfType } from './helpers/astHelpers.js';

/**
 * @typedef {import('estree').Identifier} Identifier
 * @typedef {import('estree').CallExpression} CallExpression
 */

/**
 * ノードが指定された関数の引数であるかを確認
 * @param {Identifier} node - 識別子ノード
 * @param {RegExp} functionNamePattern - 関数名のパターン
 * @returns {boolean} - ノードが指定された関数の引数であるかどうか
 */
export function isArgumentOfFunction(node, functionNamePattern) {
  /** @type {CallExpression} */
  const callExpression = findAncestorOfType(node, 'CallExpression');
  return (
    callExpression?.callee?.type === 'Identifier' &&
    functionNamePattern.test(callExpression.callee.name) &&
    callExpression.arguments.includes(node)
  );
}

/**
 * ノードがwatch関数の引数であるかを確認
 * @param {Identifier} node - 識別子ノード
 * @returns {boolean} - ノードがwatch関数の引数であるかどうか
 */
export function isWatchArguments(node) {
  /** @type {CallExpression} */
  const callExpression = findAncestorOfType(node, 'CallExpression');
  return (
    callExpression?.callee?.name === 'watch' &&
    (callExpression.arguments?.indexOf(node) === 0 ||
      (callExpression.arguments?.[0]?.type === 'ArrayExpression' &&
        callExpression.arguments?.[0]?.elements?.includes(node)))
  );
}
