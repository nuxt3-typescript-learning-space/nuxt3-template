import { addToList } from '../utils/arrayUtils.js';
import { COMPOSABLES_FUNCTION_PATTERN, REACTIVE_FUNCTIONS } from '../constants/constant.js';
import { TSESTree } from '@typescript-eslint/utils';
const { AST_NODE_TYPES } = TSESTree;
function isNodeOfType(node, type) {
  return node !== undefined && node !== null && node.type === type;
}
export const isIdentifier = (node) => isNodeOfType(node, AST_NODE_TYPES.Identifier);
export const isObjectPattern = (node) => isNodeOfType(node, AST_NODE_TYPES.ObjectPattern);
export const isProperty = (node) => isNodeOfType(node, AST_NODE_TYPES.Property);
export const isCallExpression = (node) => isNodeOfType(node, AST_NODE_TYPES.CallExpression);
export const isVariableDeclarator = (node) => isNodeOfType(node, AST_NODE_TYPES.VariableDeclarator);
export const isMemberExpression = (node) => isNodeOfType(node, AST_NODE_TYPES.MemberExpression);
export const isAssignmentPattern = (node) => isNodeOfType(node, AST_NODE_TYPES.AssignmentPattern);
export function addArgumentsToList(node, list) {
  return addToList(
    node.params.reduce((acc, param) => (isIdentifier(param) ? [...acc, param.name] : acc), []),
    list,
  );
}
export function addReactiveVariables(node, list) {
  return isFunctionCall(node, REACTIVE_FUNCTIONS) && isIdentifier(node.id) ? addToList([node.id.name], list) : list;
}
export function addToVariablesListFromCalleeWithArgument(node, list) {
  if (isFunctionCall(node, REACTIVE_FUNCTIONS) && isObjectPattern(node.id)) {
    const variableNames = node.id.properties.reduce((acc, property) => {
      if (isIdentifier(property.value)) acc.push(property.value.name);
      return acc;
    }, []);
    return addToList(variableNames, list);
  }
  return list;
}
export function addDestructuredFunctionNames(node, list) {
  if (isObjectPattern(node.id) && isCallExpression(node.init)) {
    if (isIdentifier(node.init.callee) && COMPOSABLES_FUNCTION_PATTERN.test(node.init.callee.name)) {
      const functionNames = node.id.properties.reduce((acc, property) => {
        if (isProperty(property) && isIdentifier(property.key)) acc.push(property.key.name);
        return acc;
      }, []);
      return addToList(functionNames, list);
    }
  }
  return list;
}
export function isArgumentOfFunction(node, ignoredFunctionNames) {
  const callExpression = getAncestorCallExpression(node);
  return (
    isIdentifier(callExpression?.callee) &&
    isMatchingFunctionName(callExpression.callee.name, ignoredFunctionNames) &&
    callExpression.arguments.includes(node)
  );
}
export function isMatchingFunctionName(name, ignoredFunctionNames) {
  return COMPOSABLES_FUNCTION_PATTERN.test(name) || ignoredFunctionNames.includes(name);
}
export function isWatchArgument(node) {
  const callExpression = getAncestorCallExpression(node);
  return (
    isIdentifier(callExpression?.callee) &&
    callExpression.callee.name === 'watch' &&
    (callExpression.arguments?.indexOf(node) === 0 ||
      (callExpression.arguments?.[0]?.type === 'ArrayExpression' &&
        callExpression.arguments?.[0]?.elements?.includes(node)))
  );
}
function isFunctionCall(node, functionNames) {
  return (
    isCallExpression(node.init) && isIdentifier(node.init.callee) && functionNames.includes(node.init.callee?.name)
  );
}
export function getAncestorCallExpression(node) {
  let currentNode = node.parent;
  while (currentNode && isCallExpression(currentNode)) {
    currentNode = currentNode.parent;
  }
  return isCallExpression(currentNode) ? currentNode : null;
}
export function isPropertyValue(node) {
  return isMemberExpression(node) && isIdentifier(node.property) && node.property.name === 'value';
}
export function isFunctionArgument(node, functionArguments) {
  return functionArguments.includes(node.name);
}
export function isObjectKey(node, identifierNode) {
  return isProperty(node) && isIdentifier(node.key) && node.key.name === identifierNode.name;
}
export function isOriginalDeclaration(node) {
  return isMemberExpression(node) || isProperty(node);
}
export function isDestructuredFunctionArgument(parent, grandParent, destructuredFunctions) {
  return (
    (isCallExpression(parent) && isIdentifier(parent.callee) && destructuredFunctions.includes(parent.callee.name)) ||
    (isCallExpression(grandParent) &&
      isIdentifier(grandParent.callee) &&
      destructuredFunctions.includes(grandParent.callee.name))
  );
}
export function isStoreToRefsCall(node) {
  return isCallExpression(node.init) && isIdentifier(node.init.callee) && node.init.callee.name === 'storeToRefs';
}
export function hasStateNameWithoutStateSuffix(originalName, nameToCheck, stateList) {
  return stateList.includes(originalName) && !nameToCheck.endsWith('State');
}
