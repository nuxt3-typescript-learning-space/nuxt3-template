import { isCallExpression, isObjectPattern, isIdentifier, isProperty } from './ast-helper.js';
export const isStoreToRefsDeclaration = (node) =>
  isObjectPattern(node.id) &&
  !!node.init &&
  isCallExpression(node.init) &&
  isIdentifier(node.init.callee) &&
  node.init.callee.name === 'storeToRefs';
export const isIdentifierPropertyPair = (property) => {
  return isProperty(property) && isIdentifier(property.key) && isIdentifier(property.value);
};
