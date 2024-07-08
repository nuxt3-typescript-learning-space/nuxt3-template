/**
 * @fileoverview リアクティブな値に ".value" を付けることを強制するESLintルール
 */

import { ESLintUtils } from '@typescript-eslint/utils';
import {
  addArgumentsToList,
  addReactiveVariables,
  addToVariablesListFromCalleeWithArgument,
} from './utils/reactiveVariableUtils.js';

/**
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 * @typedef {import('estree').FunctionDeclaration} FunctionDeclaration
 * @typedef {import('estree').ArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {import('estree').MemberExpression} MemberExpression
 * @typedef {import('estree').CallExpression} CallExpression
 * @typedef {import('estree').Identifier} Identifier
 * @typedef {import("estree").Node} Node
 */

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
    schema: [],
  },
  create(context) {
    const reactiveFunctions = ['toRefs', 'storeToRefs', 'computed', 'ref'];
    /** @type {string[]} */
    const variableFromReactiveFunctions = [];
    /** @type {string[]} */
    const functionArguments = [];
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    /**
     * リアクティブ関数からの変数をチェックしてリストに追加
     * @param {VariableDeclarator} node
     */
    function checkVariableDeclarator(node) {
      addReactiveVariables(node, variableFromReactiveFunctions, reactiveFunctions);
      addToVariablesListFromCalleeWithArgument(node, variableFromReactiveFunctions, reactiveFunctions);
    }

    /**
     * 関数宣言の引数をリストに追加
     * @param {FunctionDeclaration} node
     */
    function checkFunctionDeclaration(node) {
      addArgumentsToList(node, functionArguments);
    }

    /**
     * アロー関数の引数をリストに追加
     * @param {ArrowFunctionExpression} node
     */
    function checkArrowFunctionExpression(node) {
      addArgumentsToList(node, functionArguments);
    }

    /**
     * ノードがwatch関数の引数であるかを確認
     * @param {Identifier} node
     * @returns {boolean}
     */
    function isWatchArguments(node) {
      /** @type {Node} */
      let ancestor = node.parent;
      while (ancestor && ancestor.type !== 'CallExpression') {
        ancestor = ancestor.parent;
      }
      return (
        ancestor?.callee?.name === 'watch' &&
        (ancestor.arguments?.indexOf(node) === 0 ||
          (ancestor.arguments?.[0]?.type === 'ArrayExpression' && ancestor.arguments?.[0]?.elements?.includes(node)))
      );
    }

    /**
     * 識別子ノードをチェックしてルールを適用
     * @param {Identifier} node
     */
    function checkIdentifier(node) {
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

      if (
        !isVariableDeclarator &&
        !isMemberExpression &&
        !isObjectKey &&
        !isFunctionArgument &&
        !isPropertyValue &&
        !isOriginalDeclaration &&
        !isWatchArguments(node) &&
        variableFromReactiveFunctions.includes(node.name)
      ) {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const type = checker.getTypeAtLocation(tsNode);
        const typeName = checker.typeToString(type);

        console.log(type);

        if (typeName.includes('Ref') && !typeName.includes('.value')) {
          context.report({
            node,
            messageId: 'requireValueSuffix',
            data: { name: node.name },
            // NOTE: 自動修正を行う場合はコメントアウトを外す
            // fix(fixer) {
            //   return fixer.insertTextAfter(node, '.value');
            // },
          });
        }
      }
    }

    /**
     * メンバー式ノードをチェックしてルールを適用
     * @param {MemberExpression} node
     */
    function checkMemberExpression(node) {
      const isPropertyValue = node.property?.name === 'value';
      if (!isPropertyValue && variableFromReactiveFunctions.includes(node.object?.name)) {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
        const type = checker.getTypeAtLocation(tsNode);
        const typeName = checker.typeToString(type);

        console.log(typeName);

        if (typeName.includes('Ref') && !typeName.includes('.value')) {
          context.report({
            node,
            messageId: 'requireValueSuffix',
            data: { name: node.object.name },
            // NOTE: 自動修正を行う場合はコメントアウトを外す
            // fix(fixer) {
            //   return fixer.insertTextAfter(node.object, '.value');
            // },
          });
        }
      }
    }

    return {
      VariableDeclarator: checkVariableDeclarator,
      FunctionDeclaration: checkFunctionDeclaration,
      ArrowFunctionExpression: checkArrowFunctionExpression,
      Identifier: checkIdentifier,
      MemberExpression: checkMemberExpression,
    };
  },
};
