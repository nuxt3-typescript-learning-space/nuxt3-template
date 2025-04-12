import { ESLintUtils, type ParserServices, type TSESLint, type TSESTree } from '@typescript-eslint/utils';
import type { TypeChecker } from 'typescript';

/**
 * ESTreeノードに対応するTypeScriptの型を文字列として取得します。
 *
 * @param node - 型情報を取得したいESTreeノード
 * @param typeChecker - TypeScriptの型チェッカーインスタンス
 * @param parserServices - ESLintのパーサーサービス
 * @returns ノードの型を表す文字列
 *
 * @example
 * // 以下のようなコード内のノードの型を取得する場合:
 * // const value: string = 'hello';
 *
 * const { parserServices, typeChecker } = getTypeCheckingServices(context);
 * const nodeType = getTypeString(node, typeChecker, parserServices);
 * console.log(nodeType); // "string"と出力される
 *
 * // または複雑な型の場合:
 * // const obj: { name: string; age: number } = { name: 'John', age: 30 };
 *
 * const objType = getTypeString(objNode, typeChecker, parserServices);
 * console.log(objType); // "{ name: string; age: number }"と出力される
 */
export const getTypeString = <T extends TSESTree.Node>(
  node: T,
  typeChecker: TypeChecker,
  parserServices: ParserServices,
): string => {
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const type = typeChecker.getTypeAtLocation(tsNode);
  const typeString = typeChecker.typeToString(type);
  return typeString;
};

/**
 * ESLintルールコンテキストから型チェックに必要なサービスを取得します。
 * TypeScriptの型情報にアクセスするために必要なオブジェクトを返します。
 *
 * @param context - ESLintルールコンテキスト
 * @returns パーサーサービスと型チェッカーを含むオブジェクト
 *
 * @example
 * // ESLintルールの作成時に使用:
 * export const myRule = ESLintUtils.RuleCreator(...)({
 *   create(context) {
 *     // 型チェックサービスを取得
 *     const { parserServices, typeChecker } = getTypeCheckingServices(context);
 *
 *     return {
 *       Identifier(node) {
 *         // 識別子の型を取得して何らかの検証を行う
 *         const typeString = getTypeString(node, typeChecker, parserServices);
 *
 *         if (typeString === 'string') {
 *           // 文字列型の場合の処理
 *         }
 *       }
 *     };
 *   }
 * });
 */
export const getTypeCheckingServices = <T extends Readonly<TSESLint.RuleContext<string, unknown[]>>>(context: T) => {
  const parserServices = ESLintUtils.getParserServices(context);
  const typeChecker = parserServices.program.getTypeChecker();
  return { parserServices, typeChecker };
};

/**
 * ESLintルールで使用するレポートデータを作成します。
 * 識別子ノードに対するエラーまたは警告を報告する際に使用します。
 *
 * @param node - エラーまたは警告を報告したい識別子ノード
 * @param messageId - ルールで定義されたメッセージID
 * @returns context.reportに渡すためのレポートデータオブジェクト
 *
 * @example
 * // ESLintルールの作成時に使用:
 * export const myRule = ESLintUtils.RuleCreator(...)({
 *   meta: {
 *     messages: {
 *       avoidFoo: '識別子 "{{ name }}" は使用を避けるべきです'
 *     }
 *   },
 *   create(context) {
 *     return {
 *       Identifier(node) {
 *         if (node.name === 'foo') {
 *           // 'foo'という名前の識別子を見つけた場合、エラーを報告
 *           context.report(createReportData(node, 'avoidFoo'));
 *         }
 *       }
 *     };
 *   }
 * });
 *
 * // これにより、'foo'という識別子が使用されたときに
 * // "識別子 "foo" は使用を避けるべきです" というエラーメッセージが表示される
 */
export const createReportData = <MessageId extends string>(
  node: TSESTree.Identifier,
  messageId: MessageId,
): { node: TSESTree.Identifier; messageId: MessageId; data: { name: TSESTree.Identifier['name'] } } => ({
  node,
  messageId,
  data: { name: node.name },
});
