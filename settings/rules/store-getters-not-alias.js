import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 * @typedef {import('estree').Property} Property
 */

const gettersListPath = resolve(new URL(import.meta.url).pathname, '../../data/store-getters-list.json');
const gettersList = JSON.parse(readFileSync(gettersListPath, 'utf8'));

/**
 * @fileoverview gettersの値を使用する時に別名で参照しないことを強制するESLintルール
 * @type {RuleModule}
 */
export const storeGettersNotAlias = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'storeToRefsから分割代入gettersの値を使用する時は別名で参照しない',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      noAlias: 'storeToRefsから分割代入をする時、gettersの "{{name}}" を別名にして参照しないでください。',
    },
  },
  create(context) {
    /**
     * プロパティがgettersListに含まれるか確認し、必要に応じてエラーを報告する
     * @param {Property} property - チェックするプロパティノード
     */
    function checkProperty(property) {
      const originalName = property.key.name;
      const aliasName = property.value.name;
      if (gettersList.includes(originalName) && aliasName && originalName !== aliasName) {
        context.report({
          node: property,
          messageId: 'noAlias',
          data: {
            name: originalName,
          },
          // NOTE: 自動修正を有効にする場合は以下のコメントアウトを外す
          // fix: (fixer) => {
          //   return fixer.replaceText(property, originalName);
          // },
        });
      }
    }

    /**
     * VariableDeclaratorノードをチェックし、storeToRefs関数の呼び出しから生成された変数が別名で参照されていないか確認する。
     * @param {VariableDeclarator} node - チェックするASTノード
     */
    function checkVariableDeclarator(node) {
      if (
        node.id.type === 'ObjectPattern' &&
        node.init &&
        node.init.type === 'CallExpression' &&
        node.init.callee.name === 'storeToRefs'
      ) {
        node.id.properties.forEach(checkProperty);
      }
    }

    return {
      VariableDeclarator: checkVariableDeclarator,
    };
  },
};
