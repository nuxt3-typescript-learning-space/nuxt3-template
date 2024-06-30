const reactiveFunctions = ['toRefs', 'storeToRefs', 'computed'];

/**
 * @fileoverview リアクティブな値に ".value" を付けることを強制するESLintルール
 */

export const reactiveValueSuffix = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'リアクティブな値には ".value" をつける',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      requireValueSuffix: 'リアクティブな値 "{{name}}" には ".value" が必要です。"{{name}}.value" に修正してください。',
    },
    schema: [],
  },
  create(context) {
    let reactiveVariables = new Set();

    /**
     * 変数がリアクティブ関数の呼び出しで初期化されているかを確認します。
     * @param {ASTNode} node - チェックするASTノード
     * @returns {boolean} - リアクティブ関数の呼び出しで初期化されている場合はtrue
     */
    function isReactiveCallExpression(node) {
      return (
        node.init &&
        node.init.type === 'CallExpression' &&
        node.init.callee.type === 'Identifier' &&
        reactiveFunctions.includes(node.init.callee.name)
      );
    }

    /**
     * リアクティブ変数をセットに追加します。
     * @param {ASTNode} node - 追加するASTノード
     */
    function addReactiveVariables(node) {
      if (node.id.type === 'ObjectPattern') {
        node.id.properties.forEach((property) => {
          if (property.value.type === 'Identifier') {
            reactiveVariables.add(property.value.name);
          }
        });
      } else if (node.id.type === 'Identifier') {
        reactiveVariables.add(node.id.name);
      }
    }

    /**
     * リアクティブ変数が直接使用されているかを確認します。
     * @param {ASTNode} node - チェックするASTノード
     * @returns {boolean} - 直接使用されている場合はtrue
     */
    function isDirectReactiveUsage(node) {
      return (
        node.object.type === 'Identifier' &&
        reactiveVariables.has(node.object.name) &&
        node.property.name !== 'value' &&
        !(node.parent && node.parent.type === 'MemberExpression' && node.parent.property.name === 'value') &&
        !(node.parent && (node.parent.type === 'VariableDeclarator' || node.parent.type === 'Property'))
      );
    }

    /**
     * リアクティブ変数が識別子として直接使用されているかを確認します。
     * @param {ASTNode} node - チェックするASTノード
     * @returns {boolean} - 直接使用されている場合はtrue
     */
    function isReactiveIdentifier(node) {
      return (
        reactiveVariables.has(node.name) &&
        !(node.parent && node.parent.type === 'MemberExpression' && node.parent.property.name === 'value') &&
        !(node.parent && (node.parent.type === 'VariableDeclarator' || node.parent.type === 'Property'))
      );
    }

    return {
      VariableDeclarator(node) {
        if (isReactiveCallExpression(node)) {
          addReactiveVariables(node);
        }
      },
      MemberExpression(node) {
        if (isDirectReactiveUsage(node)) {
          context.report({
            node: node.property,
            messageId: 'requireValueSuffix',
            data: {
              name: node.object.name,
            },
            fix: (fixer) => {
              return fixer.insertTextAfter(node, '.value');
            },
          });
        }
      },
      Identifier(node) {
        if (isReactiveIdentifier(node)) {
          context.report({
            node: node,
            messageId: 'requireValueSuffix',
            data: {
              name: node.name,
            },
            fix: (fixer) => {
              return fixer.insertTextAfter(node, '.value');
            },
          });
        }
      },
    };
  },
};
