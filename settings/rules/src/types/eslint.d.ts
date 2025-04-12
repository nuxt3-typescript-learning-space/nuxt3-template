import type { TSESTree } from '@typescript-eslint/utils';

/**
 * キーと値の両方が識別子（Identifier）であるプロパティを表す型。
 * この型は主にオブジェクトパターン内のプロパティで、
 * 省略記法（{ prop }）または名前付き記法（{ prop: renamed }）の
 * いずれかで使用される場合を表します。
 *
 * @example
 * // 次のような分割代入パターン内のプロパティに使用:
 * const { a } = obj; // 省略記法: キーと値が同じ識別子 'a'
 * const { a: b } = obj; // 名前付き記法: キーは 'a'、値は 'b'
 *
 * // ESLintルール内の使用例:
 * if (isIdentifierPropertyPair(property)) {
 *   // property は PropertyWithIdentifier であることが保証されている
 *   const keyName = property.key.name; // プロパティのキー名
 *   const valueName = property.value.name; // プロパティの値（変数）名
 * }
 */
export type PropertyWithIdentifier = TSESTree.Property & { key: TSESTree.Identifier; value: TSESTree.Identifier };
