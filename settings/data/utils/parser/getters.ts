import {
  isIdentifier,
  isMethodDeclaration,
  isObjectLiteralExpression,
  isPropertyAssignment,
  type CallExpression,
  type ObjectLiteralElementLike,
  type ObjectLiteralExpression,
  type SourceFile,
} from 'typescript';
import { processNodeRecursively } from './astUtils';
import { isDefineStoreFunctionCall } from './pinia';

/**
 * オブジェクトリテラルからgettersプロパティを見つける純粋関数
 *
 * @param optionsObject gettersプロパティを検索するオプションオブジェクト
 * @returns gettersプロパティのノード、または見つからない場合はundefined
 */
const findGettersPropertyInOptions = (optionsObject: ObjectLiteralExpression): ObjectLiteralElementLike | undefined => {
  return optionsObject.properties.find(
    (property) => isPropertyAssignment(property) && isIdentifier(property.name) && property.name.text === 'getters',
  );
};

/**
 * gettersプロパティを処理して含まれるプロパティ名を抽出する純粋関数
 *
 * @param sourceFile ソースファイル
 * @param optionsObject gettersプロパティを含むオプションオブジェクト
 * @returns 抽出されたgettersプロパティ名の配列
 */
const processGettersPropertyAndExtractNames = (
  sourceFile: SourceFile,
  optionsObject: ObjectLiteralExpression,
): string[] => {
  const gettersProperty = findGettersPropertyInOptions(optionsObject);

  if (
    !gettersProperty ||
    !isPropertyAssignment(gettersProperty) ||
    !isObjectLiteralExpression(gettersProperty.initializer)
  ) {
    return [];
  }

  // gettersはオブジェクトリテラルのプロパティとして定義される
  // プロパティ名（ゲッター名）を抽出
  return gettersProperty.initializer.properties
    .map((property) => {
      // アロー関数形式のゲッター: gettersFunc: (state) => state.count
      if (isPropertyAssignment(property) && isIdentifier(property.name)) {
        return property.name.escapedText?.toString() || property.name.text;
      }

      // メソッド構文のゲッター: gettersFunc(state) { return state.count + 2; }
      if (isMethodDeclaration(property) && isIdentifier(property.name)) {
        return property.name.escapedText?.toString() || property.name.text;
      }

      return '';
    })
    .filter(Boolean);
};

/**
 * defineStoreの呼び出しからgettersプロパティを抽出する純粋関数
 *
 * @param sourceFile ソースファイル
 * @param callExpression defineStore関数の呼び出し式
 * @returns 抽出されたgettersプロパティ名の配列
 */
const extractGettersPropertyNamesFromDefineStoreCall = (
  sourceFile: SourceFile,
  callExpression: CallExpression,
): string[] => {
  const optionsArgument = callExpression.arguments[1];

  if (!optionsArgument || !isObjectLiteralExpression(optionsArgument)) {
    return [];
  }

  return processGettersPropertyAndExtractNames(sourceFile, optionsArgument);
};

/**
 * ソースファイルからdefineStoreの呼び出しを見つけてゲッタープロパティを抽出する純粋関数
 *
 * @param sourceFile ソースファイル
 * @returns 抽出されたゲッタープロパティ名の配列
 */
export const findDefineStoreCallsAndExtractGettersProperties = (sourceFile: SourceFile): string[] => {
  const gettersList = processNodeRecursively(sourceFile, isDefineStoreFunctionCall, (callExpression) =>
    extractGettersPropertyNamesFromDefineStoreCall(sourceFile, callExpression),
  );
  return gettersList;
};
