import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

/**
 * 与えられたノードが識別子（Identifier）であるかどうかを判定します。
 *
 * @param node - 検査するASTノード
 * @returns ノードが識別子の場合はtrue、それ以外の場合はfalse
 *
 * @example
 * // 以下のASTノードを考えます:
 * // const foo = 'bar';
 * // この場合、'foo'はIdentifierノードになります
 *
 * // AST例:
 * // {
 * //   type: 'Identifier',
 * //   name: 'foo'
 * // }
 *
 * if (isIdentifier(node)) {
 *   console.log(node.name); // 'foo'のような識別子名にアクセス可能
 * }
 */
export const isIdentifier = (node: TSESTree.Node): node is TSESTree.Identifier =>
  node.type === AST_NODE_TYPES.Identifier;

/**
 * 与えられたノードがプロパティ（Property）であるかどうかを判定します。
 *
 * @param node - 検査するASTノード
 * @returns ノードがプロパティの場合はtrue、それ以外の場合はfalse
 *
 * @example
 * // 以下のASTノードを考えます:
 * // const obj = { key: value };
 * // この場合、'key: value'の部分はPropertyノードになります
 *
 * // AST例:
 * // {
 * //   type: 'Property',
 * //   key: { type: 'Identifier', name: 'key' },
 * //   value: { type: 'Identifier', name: 'value' }
 * // }
 *
 * if (isProperty(node)) {
 *   // プロパティのkeyやvalueにアクセス可能
 *   console.log(node.key);
 *   console.log(node.value);
 * }
 */
export const isProperty = (node: TSESTree.Node): node is TSESTree.Property => node.type === AST_NODE_TYPES.Property;

/**
 * 与えられたノードが関数呼び出し式（CallExpression）であるかどうかを判定します。
 *
 * @param node - 検査するASTノード
 * @returns ノードが関数呼び出し式の場合はtrue、それ以外の場合はfalse
 *
 * @example
 * // 以下のASTノードを考えます:
 * // foo();
 * // または
 * // obj.method(arg1, arg2);
 *
 * // AST例:
 * // {
 * //   type: 'CallExpression',
 * //   callee: { type: 'Identifier', name: 'foo' },
 * //   arguments: []
 * // }
 *
 * if (isCallExpression(node)) {
 *   console.log(node.callee); // 呼び出される関数
 *   console.log(node.arguments); // 引数の配列
 * }
 */
export const isCallExpression = (node: TSESTree.Node): node is TSESTree.CallExpression =>
  node.type === AST_NODE_TYPES.CallExpression;

/**
 * 与えられたノードがオブジェクトパターン（ObjectPattern）であるかどうかを判定します。
 * オブジェクトパターンは主に分割代入で使用されます。
 *
 * @param node - 検査するASTノード
 * @returns ノードがオブジェクトパターンの場合はtrue、それ以外の場合はfalse
 *
 * @example
 * // 以下のASTノードを考えます:
 * // const { a, b } = obj;
 * // この場合、'{ a, b }'の部分はObjectPatternノードになります
 *
 * // AST例:
 * // {
 * //   type: 'ObjectPattern',
 * //   properties: [
 * //     { type: 'Property', key: { type: 'Identifier', name: 'a' }, ... },
 * //     { type: 'Property', key: { type: 'Identifier', name: 'b' }, ... }
 * //   ]
 * // }
 *
 * if (isObjectPattern(node)) {
 *   // オブジェクトパターンのプロパティ配列にアクセス可能
 *   node.properties.forEach(prop => {
 *     if (isProperty(prop) && isIdentifier(prop.key)) {
 *       console.log(prop.key.name); // 分割代入の各プロパティ名にアクセス
 *     }
 *   });
 * }
 */
export const isObjectPattern = (node: TSESTree.Node): node is TSESTree.ObjectPattern =>
  node.type === AST_NODE_TYPES.ObjectPattern;
