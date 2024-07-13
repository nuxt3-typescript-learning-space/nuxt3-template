import { readFileSync } from 'fs';
import { resolve } from 'path';
import { hasStateNameWithoutStateSuffix } from './utils/helpers/nameCheckers.js';
import { isStoreToRefsCall } from './utils/helpers/specificFunctionChecks.js';

/**
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 * @typedef {import('estree').Property} Property
 */

const stateListPath = resolve(new URL(import.meta.url).pathname, '../../data/json/store-state-list.json');
const stateList = JSON.parse(readFileSync(stateListPath, 'utf8'));

/**
 * @fileoverview stateの値を使用する時に "State" という接尾辞をつけることを強制するESLintルール
 * @type {RuleModule}
 */
export const storeStateSuffix = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'stateの値を使用する時は "State" という接尾辞をつける',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      requireStateSuffix: 'stateの "{{name}}" には "State" というSuffix(接尾辞)が必要です。',
    },
  },
  create(context) {
    /**
     * プロパティがstateListに含まれるか確認し、 "State" というsuffixがない場合はエラーを報告
     * @param {Property} property - チェックするプロパティノード
     */
    function checkProperty(property) {
      const originalName = property.key.name;
      const aliasName = property.value.name;
      const nameToCheck = aliasName || originalName;
      if (hasStateNameWithoutStateSuffix(originalName, nameToCheck, stateList)) {
        context.report({
          node: property,
          messageId: 'requireStateSuffix',
          data: {
            name: nameToCheck,
          },
          // NOTE: 自動修正を有効にする場合は以下のコメントアウトを外す
          // fix: (fixer) => {
          //   const newName = `${nameToCheck}State`;
          //   const newPropertySource = aliasName ? `${originalName}: ${newName}` : newName;
          //   return fixer.replaceText(property, newPropertySource);
          // },
        });
      }
    }

    /**
     * VariableDeclaratorノードをチェックし、storeToRefs関数の呼び出しから生成された変数に "State" 接尾辞を付ける。
     * @param {VariableDeclarator} node - チェックするASTノード
     */
    function checkVariableDeclarator(node) {
      if (isStoreToRefsCall(node)) {
        node.id.properties.forEach(checkProperty);
      }
    }

    return {
      VariableDeclarator: checkVariableDeclarator,
    };
  },
};
