import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';
import { isIdentifier, isObjectPattern, isProperty, isStoreToRefsCall } from './helpers/astHelpers.js';
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint';
import type { TypeChecker } from 'typescript';

// TypeScriptのパーサーサービスの型定義
type ParserServices = ReturnType<typeof ESLintUtils.getParserServices>;

// キーと値の両方が識別子であるプロパティの型定義
type PropertyWithIdentifier = TSESTree.Property & {
  key: TSESTree.Identifier;
  value: TSESTree.Identifier;
};

const MESSAGE_ID = 'requireStateSuffix' as const;

// ESLintルールを作成するためのヘルパー関数
const createRule = ESLintUtils.RuleCreator((name) => name);

/**
 * 対象となるプロパティかどうかを判断する関数
 * プロパティかつ、キーと値の両方が識別子である場合のみ対象とする
 */
const isEligibleProperty = (property: TSESTree.Property | TSESTree.RestElement): property is PropertyWithIdentifier => {
  // プロパティでない場合（例：スプレッド演算子）は対象外
  if (!isProperty(property)) {
    return false;
  }
  // キーと値の両方が識別子である場合のみ対象とする
  return isIdentifier(property.key) && isIdentifier(property.value);
};

/**
 * 変数名が「State」で終わるかどうかをチェックする
 */
const hasStateSuffix = (name: string): boolean => name.endsWith('State');

/**
 * 型文字列がRefかどうか(stateかgettersか)を判断する
 * 「Ref」を含み、「ComputedRef」を含まないならtrue
 */
const isNonComputedRef = (typeString: string): boolean =>
  typeString.includes('Ref') && !typeString.includes('ComputedRef');

/**
 * ノードの型文字列を取得する
 */
const getTypeString = (node: TSESTree.Node, typeChecker: TypeChecker, parserServices: ParserServices): string => {
  // ESTreeノードをTypeScriptノードに変換
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  // TypeScriptノードの型を取得して文字列に変換
  const type = typeChecker.getTypeAtLocation(tsNode);
  return typeChecker.typeToString(type);
};

/**
 * プロパティに「State」サフィックスが必要かどうかを判断する
 * 変数名がすでに「State」で終わっていない、かつ
 * 型がRefである場合にサフィックスが必要
 */
const needsStateSuffix = (
  property: PropertyWithIdentifier,
  typeChecker: TypeChecker,
  parserServices: ParserServices,
): boolean =>
  !hasStateSuffix(property.value.name) && isNonComputedRef(getTypeString(property.value, typeChecker, parserServices));

/**
 * エラーレポート用のデータを作成する
 */
const createReportData = (property: PropertyWithIdentifier) => ({
  node: property.value,
  messageId: MESSAGE_ID,
  data: { name: property.value.name },
});

/**
 * storeToRefsからの分割代入を処理する関数
 */
const processStoreToRefsDestructuring = (
  node: TSESTree.VariableDeclarator,
  context: Readonly<RuleContext<typeof MESSAGE_ID, []>>,
  typeChecker: TypeChecker,
  parserServices: ParserServices,
): void => {
  // storeToRefs関数呼び出しでない、または分割代入でない場合は処理しない
  if (!isStoreToRefsCall(node) || !isObjectPattern(node.id)) {
    return;
  }

  // 対象となるプロパティをフィルタリングし、処理する
  node.id.properties
    // 対象となるプロパティを抽出
    .filter(isEligibleProperty)
    // 「State」サフィックスが必要なプロパティを抽出
    .filter((property) => needsStateSuffix(property, typeChecker, parserServices))
    // エラーをレポート
    .forEach((property) => context.report(createReportData(property)));
};

/**
 * storeToRefsから取得した状態変数に「State」suffixを強制するESLintルール
 */
export const storeStateSuffix = createRule({
  name: 'store-state-suffix',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require "State" suffix for state values destructured from storeToRefs',
    },
    messages: {
      requireStateSuffix:
        'State variables should have "State" suffix when used with storeToRefs. Please rename "{{name}}" to "{{name}}: {{name}}State"',
    },
    schema: [], // このルールにはオプションなし
  },
  defaultOptions: [],
  // ルールの実装
  create(context) {
    // TypeScriptのパーサーサービスとタイプチェッカーを取得
    const parserServices = ESLintUtils.getParserServices(context);
    const typeChecker = parserServices.program.getTypeChecker();

    // ASTの特定ノードに対する処理を定義
    return {
      // 変数宣言の処理
      VariableDeclarator: (node) => processStoreToRefsDestructuring(node, context, typeChecker, parserServices),
    };
  },
});
