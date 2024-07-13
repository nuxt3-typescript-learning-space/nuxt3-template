import { describe, it, expect } from 'vitest';
import { isArgumentOfFunction, isWatchArguments } from '../../../rules/utils/astNodeCheckers';
import type { Identifier, CallExpression, ArrayExpression, Expression } from 'estree';

// 親プロパティを持つカスタムノード型を定義
interface NodeWithOptionalParent {
  parent?: NodeWithOptionalParent | null;
}

// テスト用のASTノードを作成
const createIdentifierNode = (
  name: string,
  parent: NodeWithOptionalParent | null,
): Identifier & NodeWithOptionalParent => {
  return {
    type: 'Identifier',
    name,
    parent,
  };
};

const createCallExpressionNode = (
  calleeName: string,
  args: (Expression & NodeWithOptionalParent)[],
  parent: NodeWithOptionalParent | null = null,
): CallExpression & NodeWithOptionalParent => {
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: calleeName,
    },
    arguments: args,
    parent,
  } as CallExpression & NodeWithOptionalParent;
};

const createArrayExpressionNode = (
  elements: (Expression & NodeWithOptionalParent)[],
  parent: NodeWithOptionalParent | null = null,
): ArrayExpression & NodeWithOptionalParent => {
  return {
    type: 'ArrayExpression',
    elements,
    parent,
  };
};

describe('settings/rules/utils/astNodeCheckers.js', () => {
  describe('isArgumentOfFunction', () => {
    it('ノードが指定された関数の引数であるかを確認する', () => {
      const callExpressionNode = createCallExpressionNode('testFunction', []);
      const identifierNode = createIdentifierNode('arg', callExpressionNode);
      callExpressionNode.arguments.push(identifierNode);

      expect(isArgumentOfFunction(identifierNode, /testFunction/)).toBe(true);
      expect(isArgumentOfFunction(identifierNode, /anotherFunction/)).toBe(false);
    });

    it('ノードが指定された関数の引数でない場合にfalseを返す', () => {
      const anotherCallExpressionNode = createCallExpressionNode('anotherFunction', []);
      const identifierNode = createIdentifierNode('arg', anotherCallExpressionNode);
      anotherCallExpressionNode.arguments.push(identifierNode);

      expect(isArgumentOfFunction(identifierNode, /testFunction/)).toBe(false);
    });
  });

  describe('isWatchArguments', () => {
    it('ノードがwatch関数の引数であるかを確認する', () => {
      const callExpressionNode = createCallExpressionNode('watch', []);
      const identifierNode = createIdentifierNode('arg', callExpressionNode);
      callExpressionNode.arguments.push(identifierNode);

      expect(isWatchArguments(identifierNode)).toBe(true);
    });

    it('ノードがwatch関数の配列引数の一部であるかを確認する', () => {
      const arrayExpressionNode = createArrayExpressionNode([]);
      const callExpressionNode = createCallExpressionNode('watch', [arrayExpressionNode]);
      arrayExpressionNode.parent = callExpressionNode;
      const identifierNode = createIdentifierNode('arg', arrayExpressionNode);
      arrayExpressionNode.elements.push(identifierNode);

      expect(isWatchArguments(identifierNode)).toBe(true);
    });

    it('ノードがwatch関数の引数でない場合にfalseを返す', () => {
      const callExpressionNode = createCallExpressionNode('watch', []);
      const anotherIdentifierNode = createIdentifierNode('anotherArg', callExpressionNode);

      expect(isWatchArguments(anotherIdentifierNode)).toBe(false);
    });

    it('ノードがwatch関数でない場合にfalseを返す', () => {
      const anotherCallExpressionNode = createCallExpressionNode('anotherFunction', []);
      const identifierNode = createIdentifierNode('arg', anotherCallExpressionNode);
      anotherCallExpressionNode.arguments.push(identifierNode);

      expect(isWatchArguments(identifierNode)).toBe(false);
    });
  });
});
