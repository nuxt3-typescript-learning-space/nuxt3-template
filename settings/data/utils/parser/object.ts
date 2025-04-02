import {
  isBlock,
  isIdentifier,
  isObjectLiteralExpression,
  isParenthesizedExpression,
  isPropertyAssignment,
  isReturnStatement,
  isSpreadAssignment,
  isVariableDeclaration,
  type ArrowFunction,
  type Expression,
  type Node,
  type ObjectLiteralExpression,
  type SourceFile,
} from 'typescript';
import { flattenArraysOfStrings, processNodeRecursively } from './astUtils';
import type { VariableDeclarationWithObjectInitializer } from '~~/settings/types/ast';

/**
 * オブジェクトリテラルからプロパティ名を抽出する純粋関数
 *
 * @param objectLiteral プロパティを抽出するオブジェクトリテラル
 * @returns 抽出されたプロパティ名の配列
 */
const extractPropertyNamesFromObjectLiteral = (objectLiteral: ObjectLiteralExpression): string[] => {
  return objectLiteral.properties
    .filter(isPropertyAssignment)
    .map((propertyAssignment) => {
      if (isIdentifier(propertyAssignment.name)) {
        return propertyAssignment.name.escapedText?.toString() || propertyAssignment.name.text;
      }
      return '';
    })
    .filter(Boolean);
};

/**
 * ノードが特定の変数名の変数宣言かどうかを判定する純粋関数（型ガード）
 *
 * @param node 判定対象のノード
 * @param targetVariableName 判定する変数名
 * @returns ノードが対象の変数宣言かどうか
 */
const isTargetVariableDeclaration = (
  node: Node,
  targetVariableName: string,
): node is VariableDeclarationWithObjectInitializer => {
  return (
    isVariableDeclaration(node) &&
    isIdentifier(node.name) &&
    node.name.text === targetVariableName &&
    !!node.initializer &&
    isObjectLiteralExpression(node.initializer)
  );
};

/**
 * 変数宣言ノードからプロパティを抽出する純粋関数
 *
 * @param variableDeclaration プロパティを抽出する変数宣言
 * @returns 抽出されたプロパティ名の配列
 */
const extractPropertyNamesFromVariableDeclaration = (
  variableDeclaration: VariableDeclarationWithObjectInitializer,
): string[] => {
  return extractPropertyNamesFromObjectLiteral(variableDeclaration.initializer);
};

/**
 * 変数名からその定義を探し、含まれるプロパティを抽出する純粋関数
 *
 * @param sourceFile ソースファイル
 * @param variableName プロパティを抽出する変数名
 * @returns 抽出されたプロパティ名の配列
 */
const findPropertyNamesFromVariable = (sourceFile: SourceFile, variableName: string): string[] => {
  return processNodeRecursively(
    sourceFile,
    (node) => isTargetVariableDeclaration(node, variableName),
    extractPropertyNamesFromVariableDeclaration,
  );
};

/**
 * オブジェクトリテラルからスプレッド演算子で展開されたプロパティを抽出する純粋関数
 *
 * @param sourceFile ソースファイル
 * @param objectLiteral プロパティを抽出するオブジェクトリテラル
 * @returns スプレッド演算子で展開されたプロパティ名の配列
 */
const extractSpreadPropertyNames = (sourceFile: SourceFile, objectLiteral: ObjectLiteralExpression): string[] => {
  // スプレッド構文を解析して、展開されたオブジェクトのプロパティ名を取得します
  const spreadElements = objectLiteral.properties.filter(isSpreadAssignment);

  return flattenArraysOfStrings(
    spreadElements.map((spreadElement) => {
      if (isIdentifier(spreadElement.expression)) {
        return findPropertyNamesFromVariable(sourceFile, spreadElement.expression.text);
      }
      return [];
    }),
  );
};

/**
 * return式からプロパティ名を抽出する純粋関数
 *
 * @param sourceFile ソースファイル
 * @param returnExpression プロパティを抽出するreturn式
 * @returns 抽出されたプロパティ名の配列
 */
export const extractPropertyNamesFromReturnExpression = (
  sourceFile: SourceFile,
  returnExpression: Expression,
): string[] => {
  if (!isObjectLiteralExpression(returnExpression)) {
    return [];
  }

  const directPropertyNames = extractPropertyNamesFromObjectLiteral(returnExpression);
  const spreadPropertyNames = extractSpreadPropertyNames(sourceFile, returnExpression);

  return [...directPropertyNames, ...spreadPropertyNames];
};

/**
 * アロー関数からreturn式を抽出する純粋関数
 *
 * @param arrowFunction return式を抽出するアロー関数
 * @returns 抽出されたreturn式、または抽出できない場合はundefined
 */
export const extractReturnExpressionFromArrowFunction = (arrowFunction: ArrowFunction): Expression | undefined => {
  // 直接オブジェクトを返す場合: () => ({ prop1, prop2 })
  if (isParenthesizedExpression(arrowFunction.body) && isObjectLiteralExpression(arrowFunction.body.expression)) {
    return arrowFunction.body.expression;
  }

  // ブロック内でreturnする場合: () => { return { prop1, prop2 } }
  if (isBlock(arrowFunction.body)) {
    const returnStatement = arrowFunction.body.statements.find(isReturnStatement);
    if (returnStatement && returnStatement.expression) {
      return returnStatement.expression;
    }
  }

  return undefined;
};
