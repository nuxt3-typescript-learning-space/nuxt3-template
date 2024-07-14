import { describe, it, expect } from 'vitest';
import { isSpecificFunctionCall, isStoreToRefsCall } from '../../../../rules/utils/helpers/specificFunctionChecks';
import type { VariableDeclarator } from 'estree';

// テスト用のASTノードを作成
const createVariableDeclarator = (initType: string, calleeName: string | null, idType: string = 'Identifier') => {
  return {
    type: 'VariableDeclarator',
    id: { type: idType },
    init: calleeName ? { type: initType, callee: { name: calleeName } } : { type: initType },
  } as VariableDeclarator;
};

describe('settings/rules/utils/helpers/specificFunctionChecks.js', () => {
  describe('isSpecificFunctionCall', () => {
    it('特定の関数呼び出しかどうかをチェックする', () => {
      const node1 = createVariableDeclarator('CallExpression', 'testFunction');
      const node2 = createVariableDeclarator('CallExpression', 'anotherFunction');
      const node3 = createVariableDeclarator('Literal', null);

      expect(isSpecificFunctionCall(node1, ['testFunction'])).toBe(true);
      expect(isSpecificFunctionCall(node2, ['testFunction'])).toBe(false);
      expect(isSpecificFunctionCall(node3, ['testFunction'])).toBe(false);
      expect(isSpecificFunctionCall(node1, /testFunction/)).toBe(true);
      expect(isSpecificFunctionCall(node2, /another/)).toBe(true);
    });

    it('関数名のリストまたはパターンが一致しない場合はfalseを返す', () => {
      const node = createVariableDeclarator('CallExpression', 'testFunction');

      expect(isSpecificFunctionCall(node, ['anotherFunction'])).toBe(false);
      expect(isSpecificFunctionCall(node, /anotherFunction/)).toBe(false);
    });
  });

  describe('isStoreToRefsCall', () => {
    it('storeToRefs関数の呼び出しかどうかをチェックする', () => {
      const node1 = createVariableDeclarator('CallExpression', 'storeToRefs', 'ObjectPattern');
      const node2 = createVariableDeclarator('CallExpression', 'otherFunction', 'ObjectPattern');
      const node3 = createVariableDeclarator('CallExpression', 'storeToRefs');

      expect(isStoreToRefsCall(node1)).toBe(true);
      expect(isStoreToRefsCall(node2)).toBe(false);
      expect(isStoreToRefsCall(node3)).toBe(false);
    });

    it('ObjectPatternでない場合はfalseを返す', () => {
      const node = createVariableDeclarator('CallExpression', 'storeToRefs', 'Identifier');
      expect(isStoreToRefsCall(node)).toBe(false);
    });
  });
});
