import type { TSESTree, TSESLint } from '@typescript-eslint/utils';

type Node = TSESTree.Node;
type Identifier = TSESTree.Identifier;
type VariableDeclarator = TSESTree.VariableDeclarator;
type ArrowFunctionExpression = TSESTree.ArrowFunctionExpression;
type FunctionDeclaration = TSESTree.FunctionDeclaration;
type CallExpression = TSESTree.CallExpression;
type MemberExpression = TSESTree.MemberExpression;
type ASTNodeType = TSESTree.AST_NODE_TYPES;

type RuleListener = TSESLint.RuleListener;

export type {
  Node,
  Identifier,
  VariableDeclarator,
  ArrowFunctionExpression,
  FunctionDeclaration,
  CallExpression,
  MemberExpression,
  RuleListener,
  ASTNodeType,
};
