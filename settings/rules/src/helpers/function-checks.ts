import { isCallExpression, isObjectPattern, isIdentifier, isProperty } from './ast-helper.js';
import type { PropertyWithIdentifier } from '../types/eslint.js';
import type { TSESTree } from '@typescript-eslint/utils';

export const isStoreToRefsDeclaration = (node: TSESTree.VariableDeclarator): boolean =>
  isObjectPattern(node.id) &&
  !!node.init &&
  isCallExpression(node.init) &&
  isIdentifier(node.init.callee) &&
  node.init.callee.name === 'storeToRefs';

/**
 * 対象となるプロパティかどうかを判断する関数
 * プロパティかつ、キーと値の両方が識別子である場合のみ対象とする
 */
export const isIdentifierPropertyPair = (
  property: TSESTree.Property | TSESTree.RestElement,
): property is PropertyWithIdentifier => {
  return isProperty(property) && isIdentifier(property.key) && isIdentifier(property.value);
};
