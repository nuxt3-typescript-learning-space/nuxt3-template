import { ESLintUtils, type TSESLint, type TSESTree, type ParserServices } from '@typescript-eslint/utils';
import { isObjectPattern } from './helpers/ast-helper.js';
import { isIdentifierPropertyPair, isStoreToRefsDeclaration } from './helpers/function-checks.js';
import { createReportData, getTypeCheckingServices, getTypeString } from './helpers/types.js';
import type { PropertyWithIdentifier } from './types/eslint.js';
import type { TypeChecker } from 'typescript';

/**
 * ルールのメッセージID
 * エラーメッセージのキーとして使用
 */
const MESSAGE_ID = 'requireStateSuffix' as const;

/**
 * ESLintルールのコンテキスト型
 * このルール特有のメッセージIDと設定オプションの型情報を含む
 */
type RuleContext = Readonly<TSESLint.RuleContext<typeof MESSAGE_ID, []>>;

/**
 * プロパティが 'State' サフィックスを必要とするかどうかを判定します。
 * 以下の条件を両方満たす場合に true を返します:
 * 1. 変数名が 'State' で終わっていない
 * 2. 型が ComputedRef ではなく Ref 型である
 *
 * @param property - 検査するプロパティ（キーと値の両方が識別子）
 * @param typeChecker - TypeScriptの型チェッカー
 * @param parserServices - ESLintのパーサーサービス
 * @returns 'State' サフィックスが必要な場合は true、それ以外は false
 *
 * @example
 * // storeToRefs(store) から分割代入された値の場合:
 * const { count } = storeToRefs(store); // count の型が Ref<number> の場合、true を返す
 * const { count: countState } = storeToRefs(store); // リネームして State サフィックスを付けた場合、false を返す
 * const { doubled } = storeToRefs(store); // doubled の型が ComputedRef<number> の場合、false を返す
 */
const needsStateSuffix = (
  property: PropertyWithIdentifier,
  typeChecker: TypeChecker,
  parserServices: ParserServices,
): boolean => {
  const typeString = getTypeString(property.value, typeChecker, parserServices);
  const hasStateSuffix = property.value.name.endsWith('State');
  const isNonComputedRef = typeString.includes('Ref') && !typeString.includes('ComputedRef');
  return !hasStateSuffix && isNonComputedRef;
};

/**
 * 変数宣言子ノードを処理し、storeToRefs から分割代入された state 変数の命名規則を検証します。
 * storeToRefs の結果から分割代入された Ref 型のプロパティが 'State' サフィックスを持っていない場合、
 * エラーを報告します。
 *
 * @param node - 処理する変数宣言子ノード
 * @param context - ESLintルールコンテキスト
 *
 * @example
 * // 以下のようなコードを検出してエラーを報告します:
 * const { count } = storeToRefs(store); // エラー: count は count: countState にリネームすべき
 *
 * // 以下のコードはエラーにならない:
 * const { count: countState } = storeToRefs(store); // リネームして State サフィックスを付けた
 * const { doubled } = storeToRefs(store); // ComputedRef の場合はサフィックス不要
 * const { count } = store; // storeToRefs を使っていない
 */
const processVariableDeclarator = (node: TSESTree.VariableDeclarator, context: RuleContext): void => {
  if (!isStoreToRefsDeclaration(node) || !isObjectPattern(node.id)) return;

  const { typeChecker, parserServices } = getTypeCheckingServices(context);

  node.id.properties
    .filter(isIdentifierPropertyPair)
    .filter((property) => needsStateSuffix(property, typeChecker, parserServices))
    .forEach((property) => {
      context.report(createReportData(property.value, MESSAGE_ID));
    });
};

/**
 * ESLintルール作成用のヘルパー関数
 */
const createRule = ESLintUtils.RuleCreator((name) => name);

/**
 * storeToRefs から分割代入された状態変数に 'State' サフィックスを要求するESLintルール。
 *
 * このルールは、Vue の Pinia ストアを使用する際のベストプラクティスを強制するために使用します。
 * storeToRefs 関数を使って取得した反応性のある状態（Ref型）プロパティには、変数名の末尾に 'State' サフィックスを
 * 付けることを推奨します。これにより、通常のプロパティと反応性のある状態プロパティを区別しやすくなります。
 *
 * ComputedRef 型のプロパティには 'State' サフィックスは必要ありません。
 *
 * @example
 * // 正しい使用法:
 * const { count: countState, name, doubled } = storeToRefs(store);
 * // countState は Ref<number> 型で、count からリネームされている
 * // name は string 型など、Ref ではない通常のプロパティ
 * // doubled は ComputedRef<number> 型
 *
 * console.log(countState.value); // Ref なので .value でアクセス
 *
 * // 誤った使用法（ルールに違反）:
 * const { count } = storeToRefs(store);
 * // count は Ref<number> 型なので `count: countState` とリネームするべき
 */
export const storeStateSuffix = createRule({
  name: 'store-state-suffix',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require "State" suffix for state values destructured from storeToRefs',
    },
    messages: {
      [MESSAGE_ID]:
        'State variables should have "State" suffix when used with storeToRefs. Please rename "{{name}}" to "{{name}}: {{name}}State"',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context: RuleContext) {
    return {
      VariableDeclarator: (node) => processVariableDeclarator(node, context),
    };
  },
});
