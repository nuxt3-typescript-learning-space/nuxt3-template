import { ESLintUtils } from '@typescript-eslint/utils';
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
  isIdentifier,
} from './helpers/astHelpers.js';
function checkNodeAndReport(node, name, context, parserServices, checker) {
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
function checkIdentifier(
  node,
  reactiveVariables,
  functionArguments,
  destructuredFunctions,
  context,
  parserServices,
  checker,
  ignoredFunctionNames,
) {
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
function checkMemberExpression(node, variableFromReactiveFunctions, context, parserServices, checker) {
  const isPropertyValue = isIdentifier(node.property) && node.property.name === 'value';
  if (!isPropertyValue && isIdentifier(node.object) && variableFromReactiveFunctions.includes(node.object.name)) {
    checkNodeAndReport(node.object, node.object.name, context, parserServices, checker);
  }
}
export const reactiveValueSuffix = {
  meta: {
    type: 'problem',
    docs: {
      description: 'リアクティブな値に対して`.value`をつけてアクセスすることを強制するカスタムルール',
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
      requireValueSuffix: 'リアクティブな値 "{{name}}" には {{name}}.value でアクセスしてください',
    },
  },
  defaultOptions: [{}],
  create(context) {
    const options = context.options[0] || {};
    const functionNamesToIgnoreValueCheck = options.functionNamesToIgnoreValueCheck || [];
    let variableFromReactiveFunctions = [];
    let functionArguments = [];
    let destructuredFunctions = [];
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
