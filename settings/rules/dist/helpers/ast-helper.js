import { AST_NODE_TYPES } from '@typescript-eslint/utils';
export const isIdentifier = (node) => node.type === AST_NODE_TYPES.Identifier;
export const isProperty = (node) => node.type === AST_NODE_TYPES.Property;
export const isCallExpression = (node) => node.type === AST_NODE_TYPES.CallExpression;
export const isObjectPattern = (node) => node.type === AST_NODE_TYPES.ObjectPattern;
