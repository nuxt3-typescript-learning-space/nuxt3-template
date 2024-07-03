import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * storeファイルに定義されているgettersのリスト
 * @type {string[]}
 */
const gettersList = JSON.parse(
  readFileSync(resolve(new URL('.', import.meta.url).pathname, '../data/store-getters-list.json'), 'utf8'),
);

/**
 * @fileoverview storeToRefsを使用する際にgettersのプロパティのエイリアスを禁止するESLintルール
 */

export const storeGettersNotSuffix = {
  meta: {
    type: 'problem',
    docs: {
      description: 'gettersをstoreToRefsで分割代入する際にgettersのプロパティのエイリアスを禁止する',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      noAlias:
        'gettersをstoreToRefsで分割代入する際に "{{original}}": "{{alias}}"のようにプロパティのエイリアスをしないでください。"{{original}}" に変更してください。',
    },
    schema: [],
  },
  create(context) {
    /**
     * プロパティがgettersListに含まれているか確認し、エイリアスが使用されている場合にエラーを報告する
     * @param {ASTNode} property - チェックするプロパティノード
     */
    function checkProperty(property) {
      if (property.key && property.value && property.key.name && property.value.name) {
        const originalName = property.key.name;
        const aliasName = property.value.name;

        if (gettersList.includes(originalName) && originalName !== aliasName) {
          context.report({
            node: property,
            messageId: 'noAlias',
            data: {
              original: originalName,
              alias: aliasName,
            },
            // NOTE: 自動修正を行う場合は以下のコメントアウトを外す
            // fix: (fixer) => {
            //   return fixer.replaceText(property, originalName);
            // },
          });
        }
      }
    }

    /**
     * VariableDeclaratorノードをチェックし、storeToRefs関数の呼び出しから生成された変数にエイリアスがないか確認する
     * @param {ASTNode} node - チェックするASTノード
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
