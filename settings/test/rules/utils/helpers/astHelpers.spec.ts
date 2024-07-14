import { describe, it, expect } from 'vitest';
import { findAncestorOfType } from '../../../../rules/utils/helpers/astHelpers';
import type { Node } from 'estree';

// Nodeの型をカスタマイズしてparentプロパティを追加するヘルパー関数を定義
const createNodeWithParent = (type: string, parent: Node | null = null): Node & { parent: Node | null } => {
  return {
    type,
    parent,
  } as Node & { parent: Node | null };
};

describe('settings/rules/utils/helpers/astHelpers.js', () => {
  it('特定のタイプの祖先ノードを見つける', () => {
    const programNode = createNodeWithParent('Program', null);
    const variableDeclarationNode = createNodeWithParent('VariableDeclaration', programNode);
    const variableDeclaratorNode = createNodeWithParent('VariableDeclarator', variableDeclarationNode);
    const identifierNode = createNodeWithParent('Identifier', variableDeclaratorNode);

    const result = findAncestorOfType(identifierNode, 'VariableDeclaration');
    expect(result).toEqual(variableDeclarationNode);
  });

  it('祖先ノードが見つからない場合はnullを返す', () => {
    const programNode = createNodeWithParent('Program', null);
    const variableDeclarationNode = createNodeWithParent('VariableDeclaration', programNode);
    const variableDeclaratorNode = createNodeWithParent('VariableDeclarator', variableDeclarationNode);
    const identifierNode = createNodeWithParent('Identifier', variableDeclaratorNode);

    const result = findAncestorOfType(identifierNode, 'FunctionDeclaration');
    expect(result).toBeNull();
  });

  it('親がないノードの場合はnullを返す', () => {
    const identifierNode = createNodeWithParent('Identifier', null);

    const result = findAncestorOfType(identifierNode, 'VariableDeclaration');
    expect(result).toBeNull();
  });
});
