import { addToList } from '../utils/arrayUtils.js';
import { COMPOSABLES_FUNCTION_PATTERN, REACTIVE_FUNCTIONS } from '../constants/constant.js';
export function addArgumentsToList(node, list) {
  const argumentsList = node.params.reduce((accumulator, parameter) => {
    if (parameter.type === 'Identifier') {
      accumulator.push(parameter.name);
    }
    return accumulator;
  }, []);
  return addToList(argumentsList, list);
}
export function addReactiveVariables(node, list) {
  if (isReactiveCall(node, REACTIVE_FUNCTIONS) && node.id.type === 'Identifier') {
    return addToList([node.id.name], list);
  }
  return list;
}
export function addToVariablesListFromCalleeWithArgument(node, list) {
  if (isReactiveCall(node, REACTIVE_FUNCTIONS) && node.id.type === 'ObjectPattern') {
    const variableNames = node.id.properties.reduce((accumulator, property) => {
      if (property?.value?.type === 'Identifier') {
        accumulator.push(property.value.name);
      }
      return accumulator;
    }, []);
    return addToList(variableNames, list);
  }
  return list;
}
export function addDestructuredFunctionNames(node, list) {
  if (node.id.type === 'ObjectPattern' && node.init?.type === 'CallExpression') {
    const callee = node.init.callee;
    if (callee.type === 'Identifier' && COMPOSABLES_FUNCTION_PATTERN.test(callee.name)) {
      const functionNames = node.id.properties.reduce((accumulator, property) => {
        if (property.type === 'Property' && property.key.type === 'Identifier') {
          accumulator.push(property.key.name);
        }
        return accumulator;
      }, []);
      return addToList(functionNames, list);
    }
  }
  return list;
}
export function isArgumentOfFunction(node, ignoredFunctionNames) {
  const callExpression = getAncestorCallExpression(node);
  return (
    callExpression?.callee?.type === 'Identifier' &&
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
    callExpression?.callee?.type === 'Identifier' &&
    callExpression.callee.name === 'watch' &&
    (callExpression.arguments?.indexOf(node) === 0 ||
      (callExpression.arguments?.[0]?.type === 'ArrayExpression' &&
        callExpression.arguments?.[0]?.elements?.includes(node)))
  );
}
export function isReactiveCall(node, reactiveFunctionNames) {
  return isFunctionCall(node, reactiveFunctionNames);
}
function isFunctionCall(node, functionNames) {
  return (
    node.init?.type === 'CallExpression' &&
    node.init.callee.type === 'Identifier' &&
    functionNames.includes(node.init.callee?.name)
  );
}
export function getAncestorCallExpression(node) {
  let currentNode = node.parent;
  while (currentNode && currentNode.type !== 'CallExpression') {
    currentNode = currentNode.parent;
  }
  return currentNode?.type === 'CallExpression' ? currentNode : null;
}
export function isVariableDeclarator(node) {
  return node?.type === 'VariableDeclarator';
}
export function isMemberExpression(node) {
  return node?.type === 'MemberExpression';
}
export function isProperty(node) {
  return node?.type === 'Property';
}
export function isPropertyValue(node) {
  return node?.type === 'MemberExpression' && node.property.type === 'Identifier' && node.property.name === 'value';
}
export function isFunctionArgument(node, functionArguments) {
  return functionArguments.includes(node.name);
}
export function isObjectKey(node, identifierNode) {
  return (
    isProperty(node) &&
    node.type === 'Property' &&
    node.key.type === 'Identifier' &&
    node.key.name === identifierNode.name
  );
}
export function isOriginalDeclaration(node) {
  return isMemberExpression(node) || isProperty(node);
}
export function isDestructuredFunctionArgument(parent, grandParent, destructuredFunctions) {
  return (
    (parent?.type === 'CallExpression' &&
      parent.callee.type === 'Identifier' &&
      destructuredFunctions.includes(parent.callee.name)) ||
    (grandParent?.type === 'CallExpression' &&
      grandParent.callee.type === 'Identifier' &&
      destructuredFunctions.includes(grandParent.callee.name))
  );
}
