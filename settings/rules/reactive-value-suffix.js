/**
 * @fileoverview リアクティブな値に ".value" を付けることを強制するESLintルール
 */

import { ESLintUtils } from '@typescript-eslint/utils';
import {
  addArgumentsToList,
  addReactiveVariables,
  addComposablesArgumentsToList,
  addSkipCheckFunctionsArgumentsToList,
} from './utils/reactiveVariableUtils.js';
import {
  COMPOSABLE_FUNCTION_PATTERN,
  REACTIVE_FUNCTIONS,
  SKIP_CHECK_ARGUMENT_FUNCTION_NAMES,
} from './utils/constant.js';
import { isArgumentOfFunction, isWatchArguments } from './utils/astNodeCheckers.js';

/**
 * @typedef {import('@typescript-eslint/utils/ts-eslint').RuleModule<'requireValueSuffix', []>} RuleModule
 * @typedef {import('@typescript-eslint/utils/ts-eslint').RuleContext} RuleContext
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 * @typedef {import('estree').FunctionDeclaration} FunctionDeclaration
 * @typedef {import('estree').ArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {import('estree').MemberExpression} MemberExpression
 * @typedef {import('estree').Identifier} Identifier
 * @typedef {import("estree").Node} Node
 * @typedef {import('typescript').TypeChecker} TypeChecker
 * @typedef {import('@typescript-eslint/utils').TSESTree.Node} TSESTreeNode
 */

/**
 * 指定したノードに対して型をチェックし、必要な修正を報告します
 * @param {TSESTreeNode} node - ASTノード
 * @param {string} name - 識別子の名前
 * @param {RuleContext} context - ESLintのコンテキスト
 * @param {ReturnType<typeof ESLintUtils.getParserServices>} parserServices - パーササービス
 * @param {TypeChecker} checker - TypeScriptの型チェッカー
 */
function checkNodeAndReport(node, name, context, parserServices, checker) {
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const type = checker.getTypeAtLocation(tsNode);
  const typeName = checker.typeToString(type);

  if (typeName.includes('Ref') && !typeName.includes('.value')) {
    context.report({
      node,
      messageId: 'requireValueSuffix',
      data: { name },
      // NOTE: 自動修正を行う場合はコメントアウトを外す
      // fix(fixer) {
      //   return fixer.insertTextAfter(node, '.value');
      // },
    });
  }
}

/**
 * 識別子ノードをチェックしてルールを適用
 * @param {Identifier} node - 識別子ノード
 * @param {string[]} variableFromReactiveFunctions - リアクティブ関数から取得された変数のリスト
 * @param {string[]} functionArguments - 関数の引数のリスト
 * @param {string[]} composablesArguments - Composables関数から取得された引数のリスト
 * @param {string[]} skipFunctionArgument - スキップする関数の引数のリスト
 * @param {RuleContext} context - ESLintのコンテキスト
 * @param {ReturnType<typeof ESLintUtils.getParserServices>} parserServices - パーササービス
 * @param {TypeChecker} checker - TypeScriptの型チェッカー
 */
function checkIdentifier(
  node,
  variableFromReactiveFunctions,
  functionArguments,
  composablesArguments,
  skipFunctionArgument,
  context,
  parserServices,
  checker,
) {
  /** @type {Node} */
  const parent = node.parent;
  const parentType = parent?.type;

  const isVariableDeclarator = parentType === 'VariableDeclarator';
  const isMemberExpression = parentType === 'MemberExpression';
  const isProperty = parentType === 'Property';
  const isPropertyValue = parent?.property?.name === 'value';
  const isFunctionArgument = functionArguments.includes(node.name);
  const isObjectKey = isProperty && parent.key.name === node.name;
  const isOriginalDeclaration = isMemberExpression || isProperty;
  const isComposablesArgument =
    parentType === 'CallExpression' &&
    parent.arguments.includes(node) &&
    parent.callee.type === 'Identifier' &&
    composablesArguments.includes(parent.callee.name);
  const isSkipFunctionArgument = skipFunctionArgument.includes(node.name);

  const shouldSkipCheck =
    isVariableDeclarator ||
    isMemberExpression ||
    isObjectKey ||
    isFunctionArgument ||
    isPropertyValue ||
    isOriginalDeclaration ||
    isComposablesArgument ||
    isSkipFunctionArgument ||
    isWatchArguments(node) ||
    isArgumentOfFunction(node, COMPOSABLE_FUNCTION_PATTERN); // NOTE: useから始まる関数名の引数は例外(composablesの関数など)

  if (!shouldSkipCheck && variableFromReactiveFunctions.includes(node.name)) {
    checkNodeAndReport(node, node.name, context, parserServices, checker);
  }
}

/**
 * メンバー式ノードをチェックしてルールを適用
 * @param {MemberExpression} node - メンバー式ノード
 * @param {string[]} variableFromReactiveFunctions - リアクティブ関数から取得された変数のリスト
 * @param {RuleContext} context - ESLintのコンテキスト
 * @param {ReturnType<typeof ESLintUtils.getParserServices>} parserServices - パーササービス
 * @param {TypeChecker} checker - TypeScriptの型チェッカー
 */
function checkMemberExpression(node, variableFromReactiveFunctions, context, parserServices, checker) {
  const isPropertyValue = node.property?.name === 'value';
  if (!isPropertyValue && variableFromReactiveFunctions.includes(node.object?.name)) {
    checkNodeAndReport(node.object, node.object.name, context, parserServices, checker);
  }
}

/** @type {RuleModule} */
export const reactiveValueSuffix = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'リアクティブな値に対して.valueでアクセスすることを強制する',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      requireValueSuffix: 'リアクティブな値 "{{name}}" には "{{name}}.value" でアクセスする必要があります。',
    },
  },
  defaultOptions: [],
  create(context) {
    /** @type {string[]} */
    const variableFromReactiveFunctions = [];
    /** @type {string[]} */
    const functionArguments = [];
    /** @type {string[]} */
    const composablesArguments = [];
    /** @type {string[]} */
    const skipFunctionArgument = [];
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    return {
      VariableDeclarator(node) {
        addReactiveVariables(node, variableFromReactiveFunctions, REACTIVE_FUNCTIONS);
        addComposablesArgumentsToList(node, composablesArguments, COMPOSABLE_FUNCTION_PATTERN);
        addSkipCheckFunctionsArgumentsToList(node, skipFunctionArgument, SKIP_CHECK_ARGUMENT_FUNCTION_NAMES);
      },
      FunctionDeclaration(node) {
        addArgumentsToList(node, functionArguments);
      },
      ArrowFunctionExpression(node) {
        addArgumentsToList(node, functionArguments);
      },
      Identifier(node) {
        checkIdentifier(
          node,
          variableFromReactiveFunctions,
          functionArguments,
          composablesArguments,
          skipFunctionArgument,
          context,
          parserServices,
          checker,
        );
      },
      MemberExpression(node) {
        checkMemberExpression(node, variableFromReactiveFunctions, context, parserServices, checker);
      },
    };
  },
};
