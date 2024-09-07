/**
 * @fileoverview リアクティブな値に対して`.value`をつけてアクセスすることを強制するカスタムルール
 */

import { ESLintUtils } from '@typescript-eslint/utils';
import type { TypeChecker } from 'typescript';
import type { TSESLint, ParserServices } from '@typescript-eslint/utils';
import type { Node, Identifier, MemberExpression, RuleListener } from './types/eslint';
import {
  addReactiveVariables,
  addToVariablesListFromCalleeWithArgument,
  addArgumentsToList,
  addDestructuredFunctionNames,
  isArgumentOfFunction,
  isWatchArgument,
  isVariableDeclarator,
  isMemberExpression,
  isPropertyValue,
  isFunctionArgument,
  isObjectKey,
  isOriginalDeclaration,
  isDestructuredFunctionArgument,
} from './helpers/astHelpers.js';

type MessageId = 'requireValueSuffix';
interface Options {
  functionNamesToIgnoreValueCheck?: string[];
}
type RuleContext = TSESLint.RuleContext<MessageId, Options[]>;
type RuleModule = TSESLint.RuleModule<MessageId, Options[]>;

/**
 * 指定したノードに対して型をチェックし、必要な修正を報告する
 * @param {Node} node - チェックするノード
 * @param {string} name - ノードの名前
 * @param {RuleContext} context - ルールのコンテキスト
 * @param {ParserServices} parserServices - パーサーサービス
 * @param {TypeChecker} checker - TypeScriptの型チェッカー
 */
function checkNodeAndReport(
  node: Node,
  name: string,
  context: RuleContext,
  parserServices: ParserServices,
  checker: TypeChecker,
) {
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const type = checker.getTypeAtLocation(tsNode);
  const typeName = checker.typeToString(type);

  if (typeName.includes('Ref') && !typeName.includes('.value')) {
    context.report({
      node,
      messageId: 'requireValueSuffix',
      data: { name },
    });
  }
}

/**
 * 識別子ノードをチェックしてルールを適用
 * @param {Identifier} node - チェックする識別子ノード
 * @param {string[]} reactiveVariables - リアクティブ変数のリスト
 * @param {string[]} functionArguments - 関数の引数のリスト
 * @param {string[]} destructuredFunctions - 分解された関数のリスト
 * @param {RuleContext} context - ルールのコンテキスト
 * @param {ParserServices} parserServices - パーサーサービス
 * @param {TypeChecker} checker - TypeScriptの型チェッカー
 * @param {string[]} ignoredFunctionNames - 無視する関数名のリスト
 * @returns {void}
 */
function checkIdentifier(
  node: Identifier,
  reactiveVariables: string[],
  functionArguments: string[],
  destructuredFunctions: string[],
  context: RuleContext,
  parserServices: ParserServices,
  checker: TypeChecker,
  ignoredFunctionNames: string[],
): void {
  const parent = node.parent;
  const grandParent = parent?.parent;

  if (
    !isVariableDeclarator(parent) &&
    !isMemberExpression(parent) &&
    !isObjectKey(parent, node) &&
    !isFunctionArgument(node, functionArguments) &&
    !isPropertyValue(parent) &&
    !isOriginalDeclaration(parent) &&
    !isWatchArgument(node) &&
    !isArgumentOfFunction(node, ignoredFunctionNames) &&
    !isDestructuredFunctionArgument(parent, grandParent, destructuredFunctions) &&
    reactiveVariables.includes(node.name)
  ) {
    checkNodeAndReport(node, node.name, context, parserServices, checker);
  }
}

/**
 * メンバー式ノードをチェックしてルールを適用
 * @param {MemberExpression} node - チェックするメンバー式ノード
 * @param {string[]} variableFromReactiveFunctions - リアクティブ関数からの変数リスト
 * @param {RuleContext} context - ルールのコンテキスト
 * @param {ParserServices} parserServices - パーサーサービス
 * @param {TypeChecker} checker - TypeScriptの型チェッカー
 * @returns {void}
 */
function checkMemberExpression(
  node: MemberExpression,
  variableFromReactiveFunctions: string[],
  context: RuleContext,
  parserServices: ParserServices,
  checker: TypeChecker,
): void {
  const isPropertyValue = node.property.type === 'Identifier' && node.property.name === 'value';
  if (
    !isPropertyValue &&
    node.object.type === 'Identifier' &&
    variableFromReactiveFunctions.includes(node.object.name)
  ) {
    checkNodeAndReport(node.object, node.object.name, context, parserServices, checker);
  }
}

export const reactiveValueSuffix: RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Rule to enforce accessing reactive values with `.value`',
      recommended: 'recommended',
    },
    schema: [
      {
        type: 'object',
        properties: {
          functionNamesToIgnoreValueCheck: {
            type: 'array',
            items: {
              type: 'string',
            },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireValueSuffix: 'Reactive value "{{name}}" should be accessed with {{name}}.value',
    },
  },
  defaultOptions: [{}],
  /**
   * ルールの実装を作成
   * @param {RuleContext} context - ルールのコンテキスト
   * @returns {RuleListener} ルールのリスナー
   */
  create(context: RuleContext): RuleListener {
    const options: Options = context.options[0] || {};
    const functionNamesToIgnoreValueCheck: string[] = options.functionNamesToIgnoreValueCheck || [];
    let variableFromReactiveFunctions: string[] = [];
    let functionArguments: string[] = [];
    let destructuredFunctions: string[] = [];
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    return {
      VariableDeclarator(node) {
        variableFromReactiveFunctions = addReactiveVariables(node, variableFromReactiveFunctions);
        variableFromReactiveFunctions = addToVariablesListFromCalleeWithArgument(node, variableFromReactiveFunctions);
        destructuredFunctions = addDestructuredFunctionNames(node, destructuredFunctions);
      },
      FunctionDeclaration(node) {
        functionArguments = addArgumentsToList(node, functionArguments);
      },
      ArrowFunctionExpression(node) {
        functionArguments = addArgumentsToList(node, functionArguments);
      },
      Identifier(node) {
        checkIdentifier(
          node,
          variableFromReactiveFunctions,
          functionArguments,
          destructuredFunctions,
          context,
          parserServices,
          checker,
          functionNamesToIgnoreValueCheck,
        );
      },
      MemberExpression(node) {
        checkMemberExpression(node, variableFromReactiveFunctions, context, parserServices, checker);
      },
    };
  },
};
