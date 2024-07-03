const reactiveFunctions = ['toRefs', 'storeToRefs', 'computed', 'ref', 'reactive'];

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
    // リアクティブ変数のスタックを管理する配列
    let reactiveVariablesStack = [];

    /**
     * スコープの開始時に呼び出され、新しいセットをスタックにプッシュする
     */
    function enterScope() {
      reactiveVariablesStack.push(new Set());
    }

    /**
     * スコープの終了時に呼び出され、スタックからセットをポップする
     */
    function exitScope() {
      reactiveVariablesStack.pop();
    }

    /**
     * 現在のスコープで管理されているリアクティブ変数のセットを返す
     * @returns {Set} 現在のスコープのリアクティブ変数セット
     */
    function currentReactiveVariables() {
      return reactiveVariablesStack[reactiveVariablesStack.length - 1];
    }

    /**
     * 変数がリアクティブ関数の呼び出しで初期化されているかを確認する
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
     * リアクティブ変数をセットに追加する
     * @param {ASTNode} node - 追加するASTノード
     */
    function addReactiveVariables(node) {
      const reactiveVariables = currentReactiveVariables();
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
     * リアクティブ変数が直接使用されているかを確認する
     * @param {ASTNode} node - チェックするASTノード
     * @returns {boolean} - 直接使用されている場合はtrue
     */
    function isDirectReactiveUsage(node) {
      const reactiveVariables = currentReactiveVariables();
      return (
        node.object.type === 'Identifier' &&
        reactiveVariables.has(node.object.name) &&
        node.property.name !== 'value' &&
        !(node.parent && node.parent.type === 'MemberExpression' && node.parent.property.name === 'value') &&
        !(node.parent && (node.parent.type === 'VariableDeclarator' || node.parent.type === 'Property'))
      );
    }

    /**
     * リアクティブ変数が識別子として直接使用されているかを確認する
     * @param {ASTNode} node - チェックするASTノード
     * @returns {boolean} - 直接使用されている場合はtrue
     */
    function isReactiveIdentifier(node) {
      const reactiveVariables = currentReactiveVariables();
      return (
        reactiveVariables.has(node.name) &&
        !(node.parent && node.parent.type === 'MemberExpression' && node.parent.property.name === 'value') &&
        !(node.parent && (node.parent.type === 'VariableDeclarator' || node.parent.type === 'Property'))
      );
    }

    return {
      // プログラム（グローバルスコープ）の開始と終了時にスコープを管理
      Program() {
        enterScope();
      },
      'Program:exit'() {
        exitScope();
      },
      // 関数スコープの開始と終了時にスコープを管理
      FunctionDeclaration() {
        enterScope();
      },
      'FunctionDeclaration:exit'() {
        exitScope();
      },
      // ブロックスコープの開始と終了時にスコープを管理
      BlockStatement() {
        enterScope();
      },
      'BlockStatement:exit'() {
        exitScope();
      },
      // リアクティブ変数の宣言を検出してセットに追加
      VariableDeclarator(node) {
        if (isReactiveCallExpression(node)) {
          addReactiveVariables(node);
        }
      },
      // リアクティブ変数が直接使用されている場合にエラーを報告
      MemberExpression(node) {
        if (isDirectReactiveUsage(node)) {
          context.report({
            node: node.property,
            messageId: 'requireValueSuffix',
            data: {
              name: node.object.name,
            },
            // NOTE: 自動修正を有効にする場合はコメントアウトを解除してください
            // fix: (fixer) => {
            //   return fixer.insertTextAfter(node, '.value');
            // },
          });
        }
      },
      // リアクティブ変数が識別子として直接使用されている場合にエラーを報告
      Identifier(node) {
        if (isReactiveIdentifier(node)) {
          context.report({
            node: node,
            messageId: 'requireValueSuffix',
            data: {
              name: node.name,
            },
            // NOTE: 自動修正を有効にする場合はコメントアウトを解除してください
            // fix: (fixer) => {
            //   return fixer.insertTextAfter(node, '.value');
            // },
          });
        }
      },
    };
  },
};
