import {
  isArrowFunction,
  isCallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  isPropertyAssignment,
  type CallExpression,
  type Node,
  type ObjectLiteralElementLike,
  type ObjectLiteralExpression,
  type SourceFile,
} from 'typescript';
import { processNodeRecursively } from './astUtils';
import { extractPropertyNamesFromReturnExpression, extractReturnExpressionFromArrowFunction } from './object';

/**
 * ノードがdefineStore関数の呼び出しかどうかを判定する純粋関数（型ガード）
 *
 * @param node 判定対象のノード
 * @returns ノードがdefineStore関数の呼び出しかどうか
 */
const isDefineStoreFunctionCall = (node: Node): node is CallExpression =>
  isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === 'defineStore';

/**
 * オブジェクトリテラルからstateプロパティを見つける純粋関数
 *
 * @param optionsObject stateプロパティを検索するオプションオブジェクト
 * @returns stateプロパティのノード、または見つからない場合はundefined
 */
const findStatePropertyInOptions = (optionsObject: ObjectLiteralExpression): ObjectLiteralElementLike | undefined => {
  return optionsObject.properties.find(
    (property) => isPropertyAssignment(property) && isIdentifier(property.name) && property.name.text === 'state',
  );
};

/**
 * stateプロパティを処理して含まれるプロパティ名を抽出する純粋関数
 *
 * @param sourceFile ソースファイル
 * @param optionsObject stateプロパティを含むオプションオブジェクト
 * @returns 抽出されたstateプロパティ名の配列
 */
const processStatePropertyAndExtractNames = (
  sourceFile: SourceFile,
  optionsObject: ObjectLiteralExpression,
): string[] => {
  const stateProperty = findStatePropertyInOptions(optionsObject);

  if (!stateProperty || !isPropertyAssignment(stateProperty) || !isArrowFunction(stateProperty.initializer)) {
    return [];
  }

  const returnExpression = extractReturnExpressionFromArrowFunction(stateProperty.initializer);
  if (!returnExpression) {
    return [];
  }

  return extractPropertyNamesFromReturnExpression(sourceFile, returnExpression);
};

/**
 * defineStoreの呼び出しからプロパティを抽出する純粋関数
 *
 * @param sourceFile ソースファイル
 * @param callExpression defineStore関数の呼び出し式
 * @returns 抽出されたプロパティ名の配列
 */
const extractPropertyNamesFromDefineStoreCall = (sourceFile: SourceFile, callExpression: CallExpression): string[] => {
  const optionsArgument = callExpression.arguments[1];

  if (!optionsArgument || !isObjectLiteralExpression(optionsArgument)) {
    return [];
  }

  return processStatePropertyAndExtractNames(sourceFile, optionsArgument);
};

/**
 * ソースファイルからdefineStoreの呼び出しを見つけてステートプロパティを抽出する純粋関数
 *
 * @param sourceFile ソースファイル
 * @returns 抽出されたステートプロパティ名の配列
 */
export const findDefineStoreCallsAndExtractStateProperties = (sourceFile: SourceFile): string[] => {
  return processNodeRecursively(sourceFile, isDefineStoreFunctionCall, (callExpression) =>
    extractPropertyNamesFromDefineStoreCall(sourceFile, callExpression),
  );
};
