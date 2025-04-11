import { AST_NODE_TYPES, type TSESTree } from '@typescript-eslint/utils';

export const isIdentifier = (node: TSESTree.Node): node is TSESTree.Identifier =>
  node.type === AST_NODE_TYPES.Identifier;

export const isProperty = (node: TSESTree.Node): node is TSESTree.Property => node.type === AST_NODE_TYPES.Property;

export const isCallExpression = (node: TSESTree.Node): node is TSESTree.CallExpression =>
  node.type === AST_NODE_TYPES.CallExpression;

export const isObjectPattern = (node: TSESTree.Node): node is TSESTree.ObjectPattern =>
  node.type === AST_NODE_TYPES.ObjectPattern;
