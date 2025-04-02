import { createSourceFile, forEachChild, ScriptTarget, type Node, type SourceFile } from 'typescript';

/**
 * ノードの子ノードを取得する純粋関数
 *
 * @param parentNode 子ノードを取得したい親ノード
 * @returns 子ノードの配列
 */
const getChildNodesFromNode = (parentNode: Node): Node[] => {
  const childNodes: Node[] = [];
  forEachChild(parentNode, (childNode) => {
    childNodes.push(childNode);
  });
  return childNodes;
};

/**
 * 配列の配列をフラット化する純粋関数
 *
 * @template T フラット化する配列の要素の型
 * @param arrayOfArrays フラット化する配列の配列
 * @returns フラット化された配列
 */
export const flattenArraysOfStrings = <T>(arrayOfArrays: T[][]): T[] => {
  return arrayOfArrays.reduce((accumulator, currentArray) => accumulator.concat(currentArray), []);
};

/**
 * 汎用的なノード処理関数
 * 再帰的にノードを処理し、条件に一致するノードから値を抽出する
 *
 * @template ResultType 抽出する値の型
 * @template NodeType 処理対象のノード型（デフォルトはNode）
 * @param currentNode 処理対象の現在のノード
 * @param nodePredicateFunction ノードが条件に一致するか判定する型ガード関数
 * @param valueExtractorFunction 条件に一致したノードから値を抽出する関数
 * @param defaultReturnValue デフォルトの戻り値（デフォルトは空配列）
 * @returns 抽出された値の配列
 */
export const processNodeRecursively = <ResultType, NodeType extends Node = Node>(
  currentNode: Node,
  nodePredicateFunction: (node: Node) => node is NodeType,
  valueExtractorFunction: (node: NodeType) => ResultType[],
  defaultReturnValue: ResultType[] = [],
): ResultType[] => {
  // 条件に一致した場合、抽出関数を実行
  if (nodePredicateFunction(currentNode)) {
    return valueExtractorFunction(currentNode);
  }

  // 子ノードを処理して結果をフラット化
  // 深さ優先探索でASTを走査し、条件に一致するノードからデータを抽出する
  return flattenArraysOfStrings(
    getChildNodesFromNode(currentNode).map((childNode) =>
      processNodeRecursively(childNode, nodePredicateFunction, valueExtractorFunction, defaultReturnValue),
    ),
  );
};

/**
 * ファイル内容からソースファイルを作成する純粋関数
 *
 * @param filePath ファイルパス
 * @param fileContent ファイルの内容
 * @returns 作成されたソースファイル
 */
export const createSourceFileFromContent = (filePath: string, fileContent: string): SourceFile => {
  return createSourceFile(filePath, fileContent, ScriptTarget.Latest, true);
};
