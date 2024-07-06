/**
 * @fileoverview リアクティブな値に ".value" を付けることを強制するESLintルール
 */

/**
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 * @typedef {import('eslint').Rule.RuleContext} RuleContext
 * @typedef {import('estree').VariableDeclarator} VariableDeclarator
 * @typedef {import('estree').Property} Property
 * @typedef {import('estree').Identifier} Identifier
 * @typedef {import('estree').FunctionDeclaration} FunctionDeclaration
 * @typedef {import('estree').ArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {import('estree').MemberExpression} MemberExpression
 * @typedef {import('estree').CallExpression} CallExpression
 */

/**
 * ASTのノードがFunctionDeclarationまたはArrowFunctionExpressionの型かを確認し、引数のリストに追加する関数
 * @param {FunctionDeclaration | ArrowFunctionExpression} node ASTのノード
 * @param {string[]} list 引数のリスト
 * @returns {void}
 */
function addArgumentsToList(node, list) {
  if (node.params.length > 0) {
    list.push(...node.params.map((param) => param.name).filter(Boolean));
  }
}

/**
 * ノードがreactiveFunctionsに含まれる変数かを確認し、リストに追加する関数
 * @param {VariableDeclarator} node ASTのノード
 * @param {string[]} list 変数名リスト
 * @param {string[]} reactiveFunctions リアクティブな関数名のリスト
 * @returns {void}
 */
function addReactiveVariables(node, list, reactiveFunctions) {
  const isReactiveCall = node.init?.type === 'CallExpression' && reactiveFunctions.includes(node.init?.callee?.name);
  if (isReactiveCall && node.id.type === 'Identifier') {
    list.push(node.id.name);
  }
}

/**
 * 変数の初期値がreactiveFunctionsに含まれる関数から取得する場合、その変数名をリストに追加する関数
 * @param {VariableDeclarator} node ASTのノード
 * @param {string[]} list 変数名リスト
 * @param {string[]} reactiveFunctions リアクティブな関数名のリスト
 * @returns {void}
 */
function addToVariablesListFromCalleeWithArgument(node, list, reactiveFunctions) {
  const isReactiveCall = node.init?.type === 'CallExpression' && reactiveFunctions.includes(node.init?.callee?.name);
  if (isReactiveCall && node.id.type === 'ObjectPattern') {
    list.push(...node.id.properties.map((property) => property.value.name).filter(Boolean));
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
    schema: [],
  },
  create(context) {
    const reactiveFunctions = ['toRefs', 'storeToRefs', 'computed', 'ref', 'reactive'];
    const variableFromReactiveFunctions = [];
    const functionArguments = [];

    /**
     * VariableDeclaratorノードをチェックする関数
     * @param {VariableDeclarator} node
     */
    function checkVariableDeclarator(node) {
      addReactiveVariables(node, variableFromReactiveFunctions, reactiveFunctions);
      addToVariablesListFromCalleeWithArgument(node, variableFromReactiveFunctions, reactiveFunctions);
    }

    /**
     * FunctionDeclarationノードをチェックする関数
     * @param {FunctionDeclaration} node
     */
    function checkFunctionDeclaration(node) {
      addArgumentsToList(node, functionArguments);
    }

    /**
     * ArrowFunctionExpressionノードをチェックする関数
     * @param {ArrowFunctionExpression} node
     */
    function checkArrowFunctionExpression(node) {
      addArgumentsToList(node, functionArguments);
    }

    /**
     * Identifierノードをチェックする関数
     * @param {Identifier} node
     */
    function checkIdentifier(node) {
      const parent = /** @type {any} */ (node.parent);
      const parentType = parent?.type;

      // ノードが.valueではないかを確認
      const parentPropertyWithoutValue = parent?.property?.name !== 'value';

      // ノードが関数の引数に含まれないかを確認
      const isNotFunctionArguments = !functionArguments.includes(node.name);

      // ノードが宣言された変数ではないかを確認
      const isNotOriginalDeclaredVariable = parentType !== 'VariableDeclarator' && parentType !== 'MemberExpression';

      // ノードがオブジェクトのキーではないかを確認
      const isNotObjectKey = !(parentType === 'Property' && parent.key.name === node.name);

      // ノードが宣言の一部ではないかを確認
      const isNotOriginalDeclaration = parentType !== 'MemberExpression' && parentType !== 'Property';

      // ノードがwatch関数の引数ではないかを確認
      let isWatchArguments = false;
      let ancestor = /** @type {any} */ (parent);
      while (ancestor && ancestor.type !== 'CallExpression') {
        ancestor = /** @type {any} */ (ancestor.parent);
      }

      const isWatch = ancestor?.callee?.name === 'watch';
      if (isWatch) {
        const isNormalWatchArguments =
          parentType === 'CallExpression' && parent.callee?.name === 'watch' && ancestor.arguments?.indexOf(node) === 0;
        const isArrayWatchArguments =
          parentType === 'ArrayExpression' &&
          parent.parent?.type === 'CallExpression' &&
          parent.parent?.callee?.name === 'watch';
        isWatchArguments = isNormalWatchArguments || isArrayWatchArguments;
      }

      // 条件をすべて満たす場合に警告を報告
      if (
        isNotOriginalDeclaredVariable &&
        isNotObjectKey &&
        !isWatchArguments &&
        isNotFunctionArguments &&
        parentPropertyWithoutValue &&
        isNotOriginalDeclaration &&
        variableFromReactiveFunctions.includes(node.name)
      ) {
        context.report({
          node,
          messageId: 'requireValueSuffix',
          data: { name: node.name },
        });
      }
    }

    /**
     * MemberExpressionノードをチェックする関数
     * @param {MemberExpression} node
     */
    function checkMemberExpression(node) {
      const propertyWithoutValue = node.property?.name !== 'value';
      if (propertyWithoutValue && variableFromReactiveFunctions.includes(node.object?.name)) {
        context.report({
          node,
          messageId: 'requireValueSuffix',
          data: { name: node.object.name },
        });
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
