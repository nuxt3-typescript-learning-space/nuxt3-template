import { addToList } from '../utils/arrayUtils.js';
import { COMPOSABLES_FUNCTION_PATTERN, REACTIVE_FUNCTIONS } from '../constants/constant.js';
import { TSESTree } from '@typescript-eslint/utils';
import type {
  Node,
  ArrowFunctionExpression,
  CallExpression,
  FunctionDeclaration,
  Identifier,
  VariableDeclarator,
  ObjectPattern,
  Property,
  MemberExpression,
  ASTNodeType,
  AssignmentPattern,
} from '../types/eslint.js';

const { AST_NODE_TYPES } = TSESTree;

/**
 * 指定されたノードが特定のタイプかどうかを確認する関数
 * @template T ノードの型
 * @param {Node | undefined | null} node チェックしたいノード
 * @param {ASTNodeType} type ノードタイプ（例: Identifier, ObjectPatternなど）
 * @returns {node is T} 指定された型に一致するかどうか
 */
function isNodeOfType<T extends Node>(node: Node | undefined | null, type: ASTNodeType): node is T {
  return node !== undefined && node !== null && node.type === type;
}

/**
 * ノードがIdentifier（識別子）かどうかを確認する関数
 * @param {Node | undefined} node チェックするノード
 * @returns {node is Identifier} ノードが識別子かどうか
 */
export const isIdentifier = (node: Node | undefined): node is Identifier =>
  isNodeOfType<Identifier>(node, AST_NODE_TYPES.Identifier);

/**
 * ノードがObjectPattern（オブジェクトパターン）かどうかを確認する関数
 * @param {Node | undefined} node チェックするノード
 * @returns {node is ObjectPattern} ノードがオブジェクトパターンかどうか
 */
export const isObjectPattern = (node: Node | undefined): node is ObjectPattern =>
  isNodeOfType<ObjectPattern>(node, AST_NODE_TYPES.ObjectPattern);

/**
 * ノードがProperty（プロパティ）かどうかを確認する関数
 * @param {Node | undefined} node チェックするノード
 * @returns {node is Property} ノードがプロパティかどうか
 */
export const isProperty = (node: Node | undefined): node is Property =>
  isNodeOfType<Property>(node, AST_NODE_TYPES.Property);

/**
 * ノードがCallExpression（関数呼び出し）かどうかを確認する関数
 * @param {Node | undefined | null} node チェックするノード
 * @returns {node is CallExpression} ノードが関数呼び出しかどうか
 */
export const isCallExpression = (node: Node | undefined | null): node is CallExpression =>
  isNodeOfType<CallExpression>(node, AST_NODE_TYPES.CallExpression);

/**
 * ノードがVariableDeclarator（変数宣言）かどうかを確認する関数
 * @param {Node | undefined} node チェックするノード
 * @returns {node is VariableDeclarator} ノードが変数宣言かどうか
 */
export const isVariableDeclarator = (node: Node | undefined): node is VariableDeclarator =>
  isNodeOfType<VariableDeclarator>(node, AST_NODE_TYPES.VariableDeclarator);

/**
 * ノードがMemberExpression（メンバー式）かどうかを確認する関数
 * @param {Node | undefined} node チェックするノード
 * @returns {node is MemberExpression} ノードがメンバー式かどうか
 */
export const isMemberExpression = (node: Node | undefined): node is MemberExpression =>
  isNodeOfType<MemberExpression>(node, AST_NODE_TYPES.MemberExpression);

/**
 * ノードがAssignmentPattern（代入パターン）かどうかを確認する関数
 * @param {Node | undefined} node チェックするノード
 * @returns {node is AssignmentPattern} ノードが代入パターンかどうか
 */
export const isAssignmentPattern = (node: Node | undefined): node is AssignmentPattern =>
  isNodeOfType<AssignmentPattern>(node, AST_NODE_TYPES.AssignmentPattern);

/**
 * 関数の引数をリストに追加
 * @param {FunctionDeclaration | ArrowFunctionExpression} node 関数の宣言
 * @param {string[]} list 既存のリスト
 * @returns {string[]} 引数が追加されたリスト
 */
export function addArgumentsToList(node: FunctionDeclaration | ArrowFunctionExpression, list: string[]): string[] {
  return addToList(
    node.params.reduce<string[]>((acc, param) => (isIdentifier(param) ? [...acc, param.name] : acc), []),
    list,
  );
}

/**
 * リアクティブな変数をリストに追加
 * @param {VariableDeclarator} node 変数宣言ノード
 * @param {string[]} list 既存のリスト
 * @returns {string[]} 変数が追加されたリスト
 */
export function addReactiveVariables(node: VariableDeclarator, list: string[]): string[] {
  return isFunctionCall(node, REACTIVE_FUNCTIONS) && isIdentifier(node.id) ? addToList([node.id.name], list) : list;
}

/**
 * 変数の初期値がリアクティブ関数から取得される場合、その変数名をリストに追加
 * @param {VariableDeclarator} node 変数宣言ノード
 * @param {string[]} list 既存のリスト
 * @returns {string[]} 変数名が追加されたリスト
 */
export function addToVariablesListFromCalleeWithArgument(node: VariableDeclarator, list: string[]): string[] {
  if (isFunctionCall(node, REACTIVE_FUNCTIONS) && isObjectPattern(node.id)) {
    const variableNames = node.id.properties.reduce<string[]>((acc, property) => {
      if (isIdentifier(property.value)) acc.push(property.value.name);
      return acc;
    }, []);
    return addToList(variableNames, list);
  }
  return list;
}

/**
 * useから始まる関数(composablesなど)から分割代入された関数をリストに追加
 * @param {VariableDeclarator} node 変数宣言ノード
 * @param {string[]} list 既存のリスト
 * @returns {string[]} 関数名が追加されたリスト
 */
export function addDestructuredFunctionNames(node: VariableDeclarator, list: string[]): string[] {
  if (isObjectPattern(node.id) && isCallExpression(node.init)) {
    if (isIdentifier(node.init.callee) && COMPOSABLES_FUNCTION_PATTERN.test(node.init.callee.name)) {
      const functionNames = node.id.properties.reduce<string[]>((acc, property) => {
        if (isProperty(property) && isIdentifier(property.key)) acc.push(property.key.name);
        return acc;
      }, []);
      return addToList(functionNames, list);
    }
  }
  return list;
}

/**
 * 指定された関数の引数であるかを確認
 * @param {Identifier} node ノード
 * @param {string[]} ignoredFunctionNames 無視する関数名のリスト
 * @returns {boolean} 指定された関数の引数であるかどうか
 */
export function isArgumentOfFunction(node: Identifier, ignoredFunctionNames: string[]): boolean {
  const callExpression = getAncestorCallExpression(node);
  return (
    isIdentifier(callExpression?.callee) &&
    isMatchingFunctionName(callExpression.callee.name, ignoredFunctionNames) &&
    callExpression.arguments.includes(node)
  );
}

/**
 * 関数名が指定されたパターンに一致するかを確認
 * @param {string} name 関数名
 * @param {string[]} ignoredFunctionNames 無視する関数名のリスト
 * @returns {boolean} 関数名が一致するかどうか
 */
export function isMatchingFunctionName(name: string, ignoredFunctionNames: string[]): boolean {
  return COMPOSABLES_FUNCTION_PATTERN.test(name) || ignoredFunctionNames.includes(name);
}

/**
 * ノードがwatch関数の引数であるかを確認
 * @param {Identifier} node ノード
 * @returns {boolean} watch関数の引数であるかどうか
 */
export function isWatchArgument(node: Identifier): boolean {
  const callExpression = getAncestorCallExpression(node);
  return (
    isIdentifier(callExpression?.callee) &&
    callExpression.callee.name === 'watch' &&
    (callExpression.arguments?.indexOf(node) === 0 ||
      (callExpression.arguments?.[0]?.type === 'ArrayExpression' &&
        callExpression.arguments?.[0]?.elements?.includes(node)))
  );
}

/**
 * ノードが指定された関数の呼び出しかどうかをチェック
 * @param {VariableDeclarator} node 変数宣言ノード
 * @param {string[]} functionNames チェック対象の関数名リスト
 * @returns {boolean} 関数呼び出しかどうか
 */
function isFunctionCall(node: VariableDeclarator, functionNames: string[]): boolean {
  return (
    isCallExpression(node.init) && isIdentifier(node.init.callee) && functionNames.includes(node.init.callee?.name)
  );
}

/**
 * 親ノードを辿って最初のCallExpressionノードを取得
 * @param {Node} node ノード
 * @returns {CallExpression | null} 最初に見つかったCallExpressionノード、見つからない場合はnull
 */
export function getAncestorCallExpression(node: Node): CallExpression | null {
  let currentNode = node.parent;
  while (currentNode && isCallExpression(currentNode)) {
    currentNode = currentNode.parent;
  }
  return isCallExpression(currentNode) ? currentNode : null;
}

/**
 * ノードがPropertyValueかどうかをチェック
 * @param {Node} node チェックするノード
 * @returns {boolean} プロパティ値かどうか
 */
export function isPropertyValue(node: Node): boolean {
  return isMemberExpression(node) && isIdentifier(node.property) && node.property.name === 'value';
}

/**
 * ノードが関数の引数かどうかをチェック
 * @param {Identifier} node ノード
 * @param {string[]} functionArguments 関数引数のリスト
 * @returns {boolean} 引数かどうか
 */
export function isFunctionArgument(node: Identifier, functionArguments: string[]): boolean {
  return functionArguments.includes(node.name);
}

/**
 * ノードがオブジェクトのキーかどうかをチェック
 * @param {Node} node チェックするノード
 * @param {Identifier} identifierNode チェック対象の識別子ノード
 * @returns {boolean} オブジェクトのキーかどうか
 */
export function isObjectKey(node: Node, identifierNode: Identifier): boolean {
  return isProperty(node) && isIdentifier(node.key) && node.key.name === identifierNode.name;
}

/**
 * ノードが元の宣言かどうかをチェック
 * @param {Node} node チェックするノード
 * @returns {boolean} 元の宣言かどうか
 */
export function isOriginalDeclaration(node: Node): boolean {
  return isMemberExpression(node) || isProperty(node);
}

/**
 * ノードが分割代入された関数の引数かどうかをチェック
 * @param {Node} parent 親ノード
 * @param {Node | undefined} grandParent 祖父ノード
 * @param {string[]} destructuredFunctions 分割代入された関数のリスト
 * @returns {boolean} 分割代入された関数の引数かどうか
 */
export function isDestructuredFunctionArgument(
  parent: Node,
  grandParent: Node | undefined,
  destructuredFunctions: string[],
): boolean {
  return (
    (isCallExpression(parent) && isIdentifier(parent.callee) && destructuredFunctions.includes(parent.callee.name)) ||
    (isCallExpression(grandParent) &&
      isIdentifier(grandParent.callee) &&
      destructuredFunctions.includes(grandParent.callee.name))
  );
}

/**
 * storeToRefs関数の呼び出しかどうかをチェック
 * @param {VariableDeclarator} node 変数宣言ノード
 * @returns {boolean} storeToRefs関数の呼び出しかどうか
 */
export function isStoreToRefsCall(node: VariableDeclarator): boolean {
  return isCallExpression(node.init) && isIdentifier(node.init.callee) && node.init.callee.name === 'storeToRefs';
}

/**
 * 変数名がstateリストに含まれていて、接尾辞が "State" で終わっていないかをチェック
 * @param {string} originalName 元の変数名
 * @param {string} nameToCheck チェックする変数名
 * @param {string[]} stateList stateリスト
 * @returns {boolean} チェック結果
 */
export function hasStateNameWithoutStateSuffix(
  originalName: string,
  nameToCheck: string,
  stateList: string[],
): boolean {
  return stateList.includes(originalName) && !nameToCheck.endsWith('State');
}
