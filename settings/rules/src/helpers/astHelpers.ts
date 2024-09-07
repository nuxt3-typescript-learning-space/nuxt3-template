import { addToList } from '../utils/arrayUtils.js';
import { COMPOSABLES_FUNCTION_PATTERN, REACTIVE_FUNCTIONS } from '../constants/constant.js';
import type {
  Node,
  ArrowFunctionExpression,
  CallExpression,
  FunctionDeclaration,
  Identifier,
  VariableDeclarator,
} from '../types/eslint.js';

/**
 * 関数の引数をリストに追加する関数
 * @param {FunctionDeclaration | ArrowFunctionExpression} node - ASTのノード
 * @param {string[]} list - 引数のリスト
 * @returns {string[]} - 更新された引数のリスト
 */
export function addArgumentsToList(node: FunctionDeclaration | ArrowFunctionExpression, list: string[]): string[] {
  const argumentsList = node.params.reduce((accumulator: string[], parameter) => {
    if (parameter.type === 'Identifier') {
      accumulator.push(parameter.name);
    }
    return accumulator;
  }, []);
  return addToList(argumentsList, list);
}

/**
 * リアクティブな変数をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 変数名のリスト
 * @returns {string[]} - 更新された変数名のリスト
 */
export function addReactiveVariables(node: VariableDeclarator, list: string[]): string[] {
  if (isReactiveCall(node, REACTIVE_FUNCTIONS) && node.id.type === 'Identifier') {
    return addToList([node.id.name], list);
  }
  return list;
}

/**
 * 変数の初期値がリアクティブ関数から取得する場合、その変数名をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 変数名のリスト
 * @returns {string[]} - 更新された変数名のリスト
 */
export function addToVariablesListFromCalleeWithArgument(node: VariableDeclarator, list: string[]): string[] {
  if (isReactiveCall(node, REACTIVE_FUNCTIONS) && node.id.type === 'ObjectPattern') {
    const variableNames: string[] = node.id.properties.reduce((accumulator: string[], property) => {
      if (property?.value?.type === 'Identifier') {
        accumulator.push(property.value.name);
      }
      return accumulator;
    }, []);
    return addToList(variableNames, list);
  }
  return list;
}

/**
 * useから始まる関数(composablesなど)から分割代入された関数をリストに追加する関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} list - 分割代入された関数のリスト
 * @returns {string[]} - 更新された関数のリスト
 */
export function addDestructuredFunctionNames(node: VariableDeclarator, list: string[]): string[] {
  if (node.id.type === 'ObjectPattern' && node.init?.type === 'CallExpression') {
    const callee = node.init.callee;
    if (callee.type === 'Identifier' && COMPOSABLES_FUNCTION_PATTERN.test(callee.name)) {
      const functionNames = node.id.properties.reduce((accumulator: string[], property) => {
        if (property.type === 'Property' && property.key.type === 'Identifier') {
          accumulator.push(property.key.name);
        }
        return accumulator;
      }, []);
      return addToList(functionNames, list);
    }
  }
  return list;
}

/**
 * ノードが指定された関数の引数であるかを確認
 * @param {Identifier} node - 識別子ノード
 * @param {string[]} ignoredFunctionNames - 特別にtrueにしたい関数名の配列
 * @returns {boolean} - ノードが指定された関数の引数であるかどうか
 */
export function isArgumentOfFunction(node: Identifier, ignoredFunctionNames: string[]): boolean {
  const callExpression = getAncestorCallExpression(node);

  return (
    callExpression?.callee?.type === 'Identifier' &&
    isMatchingFunctionName(callExpression.callee.name, ignoredFunctionNames) &&
    callExpression.arguments.includes(node)
  );
}

/**
 * @param {string} name - 識別子ノード
 * @param {string[]} ignoredFunctionNames - 特別にtrueにしたい関数名の配列
 */
export function isMatchingFunctionName(name: string, ignoredFunctionNames: string[]) {
  return COMPOSABLES_FUNCTION_PATTERN.test(name) || ignoredFunctionNames.includes(name);
}

/**
 * ノードがwatch関数の引数であるかを確認
 * @param {Identifier} node - 識別子ノード
 * @returns {boolean} - ノードがwatch関数の引数であるかどうか
 */
export function isWatchArgument(node: Identifier): boolean {
  const callExpression = getAncestorCallExpression(node);
  return (
    callExpression?.callee?.type === 'Identifier' &&
    callExpression.callee.name === 'watch' &&
    (callExpression.arguments?.indexOf(node) === 0 ||
      (callExpression.arguments?.[0]?.type === 'ArrayExpression' &&
        callExpression.arguments?.[0]?.elements?.includes(node)))
  );
}

/**
 * ノードがリアクティブな関数呼び出しかどうかをチェックする関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} reactiveFunctionNames - リアクティブな関数名のリスト
 * @returns {boolean} - リアクティブな関数からの呼び出しであればtrue、そうでなければfalse
 */
export function isReactiveCall(node: VariableDeclarator, reactiveFunctionNames: string[]): boolean {
  return isFunctionCall(node, reactiveFunctionNames);
}

/**
 * ノードが指定された関数の呼び出しかどうかをチェックするヘルパー関数
 * @param {VariableDeclarator} node - ASTのノード
 * @param {string[]} functionNames - 関数名のリスト
 * @returns {boolean} - 指定された関数の呼び出しであればtrue、そうでなければfalse
 */
function isFunctionCall(node: VariableDeclarator, functionNames: string[]): boolean {
  return (
    node.init?.type === 'CallExpression' &&
    node.init.callee.type === 'Identifier' &&
    functionNames.includes(node.init.callee?.name)
  );
}

/**
 * 親ノードを辿って最初のCallExpressionノードを取得するヘルパー関数
 * @param {Node} node - 開始ノード
 * @returns {CallExpression | null} - 最初のCallExpressionノード、存在しない場合はnull
 */
export function getAncestorCallExpression(node: Node): CallExpression | null {
  let currentNode = node.parent;
  while (currentNode && currentNode.type !== 'CallExpression') {
    currentNode = currentNode.parent;
  }
  return currentNode?.type === 'CallExpression' ? currentNode : null;
}

/**
 * ノードがVariableDeclaratorかどうかをチェックする関数
 * @param {Node} node - チェックするノード
 * @returns {boolean} - VariableDeclaratorであればtrue、そうでなければfalse
 */
export function isVariableDeclarator(node: Node): boolean {
  return node?.type === 'VariableDeclarator';
}

/**
 * ノードがMemberExpressionかどうかをチェックする関数
 * @param {Node} node - チェックするノード
 * @returns {boolean} - MemberExpressionであればtrue、そうでなければfalse
 */
export function isMemberExpression(node: Node): boolean {
  return node?.type === 'MemberExpression';
}

/**
 * ノードがPropertyかどうかをチェックする関数
 * @param {Node} node - チェックするノード
 * @returns {boolean} - Propertyであればtrue、そうでなければfalse
 */
export function isProperty(node: Node): boolean {
  return node?.type === 'Property';
}

/**
 * ノードがPropertyValueかどうかをチェックする関数
 * @param {Node} node - チェックするノード
 * @returns {boolean} - PropertyValueであればtrue、そうでなければfalse
 */
export function isPropertyValue(node: Node): boolean {
  return node?.type === 'MemberExpression' && node.property.type === 'Identifier' && node.property.name === 'value';
}

/**
 * ノードが関数の引数かどうかをチェックする関数
 * @param {Identifier} node - チェックするASTノード
 * @param {string[]} functionArguments - 関数の引数のリスト
 * @returns {boolean} - 関数の引数であればtrue、そうでなければfalse
 */
export function isFunctionArgument(node: Identifier, functionArguments: string[]): boolean {
  return functionArguments.includes(node.name);
}

/**
 * ノードがオブジェクトのキーかどうかをチェックする関数
 * @param {Node} node - チェックするノード
 * @param {Identifier} identifierNode - 識別子ノード
 * @returns {boolean} - オブジェクトのキーであればtrue、そうでなければfalse
 */
export function isObjectKey(node: Node, identifierNode: Identifier): boolean {
  return (
    isProperty(node) &&
    node.type === 'Property' &&
    node.key.type === 'Identifier' &&
    node.key.name === identifierNode.name
  );
}

/**
 * ノードが元の宣言かどうかをチェックする関数
 * @param {Node} node - チェックするノード
 * @returns {boolean} - 元の宣言であればtrue、そうでなければfalse
 */
export function isOriginalDeclaration(node: Node): boolean {
  return isMemberExpression(node) || isProperty(node);
}

/**
 * ノードが分割代入された関数の引数かどうかをチェックする関数
 * @param {Node} parent - 親ノード
 * @param {Node | undefined} grandParent - 祖父ノード
 * @param {string[]} destructuredFunctions - 分割代入された関数のリスト
 * @returns {boolean} - 分割代入された関数の引数であればtrue、そうでなければfalse
 */
export function isDestructuredFunctionArgument(
  parent: Node,
  grandParent: Node | undefined,
  destructuredFunctions: string[],
): boolean {
  return (
    (parent?.type === 'CallExpression' &&
      parent.callee.type === 'Identifier' &&
      destructuredFunctions.includes(parent.callee.name)) ||
    (grandParent?.type === 'CallExpression' &&
      grandParent.callee.type === 'Identifier' &&
      destructuredFunctions.includes(grandParent.callee.name))
  );
}

/**
 * storeToRefs関数の呼び出しかどうかをチェックするヘルパー関数
 * @param {VariableDeclarator} node - チェックするASTノード
 * @returns {boolean} - storeToRefs関数の呼び出しかどうか
 */
export function isStoreToRefsCall(node: VariableDeclarator): boolean {
  return (node.init &&
    node.init.type === 'CallExpression' &&
    node.init.callee.type === 'Identifier' &&
    node.init.callee.name === 'storeToRefs') as boolean;
}

/**
 * 変数名がstateリストに含まれていて、接尾辞が "State" で終わっていないかをチェックするヘルパー関数
 * @param {string} originalName - 元の変数名
 * @param {string} nameToCheck - チェックする変数名
 * @param {string[]} stateList - stateのリスト
 * @returns {boolean} - 変数名が状態リストに含まれていて、接尾辞が "State" で終わっていない場合は true
 */
export function hasStateNameWithoutStateSuffix(
  originalName: string,
  nameToCheck: string,
  stateList: string[],
): boolean {
  return stateList.includes(originalName) && !nameToCheck.endsWith('State');
}
