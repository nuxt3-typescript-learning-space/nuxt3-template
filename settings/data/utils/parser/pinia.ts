import { isCallExpression, isIdentifier, type CallExpression, type Node } from 'typescript';

/**
 * ノードがdefineStore関数の呼び出しかどうかを判定する純粋関数（型ガード）
 *
 * @param node 判定対象のノード
 * @returns ノードがdefineStore関数の呼び出しかどうか
 */
export const isDefineStoreFunctionCall = (node: Node): node is CallExpression =>
  isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === 'defineStore';
