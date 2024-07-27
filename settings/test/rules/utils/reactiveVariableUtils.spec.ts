import { describe, it, expect } from 'vitest';
import {
  addReactiveVariables,
  addComposablesArgumentsToList,
  addSkipCheckFunctionsArgumentsToList,
  addArgumentsToList,
} from '../../../rules/utils/reactiveVariableUtils';
import type {
  VariableDeclarator,
  FunctionDeclaration,
  ArrowFunctionExpression,
  ObjectPattern,
  AssignmentProperty,
  Identifier,
} from 'estree';

// プロパティを持つオブジェクトパターンを定義
interface ObjectPatternWithProperties extends ObjectPattern {
  properties: AssignmentProperty[];
}

const createVariableDeclarator = (
  idType: 'Identifier' | 'ObjectPattern',
  idName: string,
  initType: 'CallExpression',
  calleeName: string | null,
  properties?: AssignmentProperty[],
): VariableDeclarator => {
  let idNode: Identifier | ObjectPatternWithProperties;
  if (idType === 'Identifier') {
    idNode = { type: idType, name: idName } as Identifier;
  } else {
    idNode = { type: idType, properties: properties || [] } as ObjectPatternWithProperties;
  }
  return {
    type: 'VariableDeclarator',
    id: idNode,
    init: calleeName ? { type: initType, callee: { name: calleeName } } : { type: initType },
  } as VariableDeclarator;
};

const createFunctionDeclaration = (paramNames: string[]): FunctionDeclaration => {
  return {
    type: 'FunctionDeclaration',
    id: { type: 'Identifier', name: 'testFunction' },
    params: paramNames.map((name) => ({ type: 'Identifier', name })),
    body: { type: 'BlockStatement', body: [] },
  };
};

const createArrowFunctionExpression = (paramNames: string[]): ArrowFunctionExpression => {
  return {
    type: 'ArrowFunctionExpression',
    params: paramNames.map((name) => ({ type: 'Identifier', name })),
    body: { type: 'BlockStatement', body: [] },
    expression: false,
  };
};

describe('settings/rules/utils/reactiveVariableUtils.js', () => {
  describe('addReactiveVariables', () => {
    it('リアクティブな識別子をリストに追加する', () => {
      const list: string[] = [];
      const node = createVariableDeclarator('Identifier', 'reactiveVar', 'CallExpression', 'ref');
      addReactiveVariables(node, list, ['ref']);
      expect(list).toEqual(['reactiveVar']);
    });

    it('リアクティブなオブジェクトパターンをリストに追加する', () => {
      const list: string[] = [];
      const properties: AssignmentProperty[] = [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'prop1' },
          value: { type: 'Identifier', name: 'prop1' },
          kind: 'init',
          method: false,
          shorthand: false,
          computed: false,
        },
      ];
      const node = createVariableDeclarator('ObjectPattern', 'reactiveObject', 'CallExpression', 'toRefs', properties);
      addReactiveVariables(node, list, ['toRefs']);
      expect(list).toEqual(['prop1']);
    });
  });

  describe('addComposablesArgumentsToList', () => {
    it('composables関数の引数をリストに追加する', () => {
      const list: string[] = [];
      const properties: AssignmentProperty[] = [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'arg1' },
          value: { type: 'Identifier', name: 'arg1' },
          kind: 'init',
          method: false,
          shorthand: false,
          computed: false,
        },
      ];
      const node = createVariableDeclarator(
        'ObjectPattern',
        'composablesArg',
        'CallExpression',
        'useSomething',
        properties,
      );
      addComposablesArgumentsToList(node, list, /^use[A-Z]/);
      expect(list).toEqual(['arg1']);
    });
  });

  describe('addSkipCheckFunctionsArgumentsToList', () => {
    it('スキップする関数の引数をリストに追加する', () => {
      const list: string[] = [];
      const properties: AssignmentProperty[] = [
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'arg1' },
          value: { type: 'Identifier', name: 'arg1' },
          kind: 'init',
          method: false,
          shorthand: false,
          computed: false,
        },
      ];
      const node = createVariableDeclarator('ObjectPattern', 'skipArg', 'CallExpression', 'skipFunction', properties);
      addSkipCheckFunctionsArgumentsToList(node, list, ['skipFunction']);
      expect(list).toEqual(['arg1']);
    });
  });

  describe('addArgumentsToList', () => {
    it('関数の引数をリストに追加する (FunctionDeclaration)', () => {
      const list: string[] = [];
      const node = createFunctionDeclaration(['arg1', 'arg2']);
      addArgumentsToList(node, list);
      expect(list).toEqual(['arg1', 'arg2']);
    });

    it('関数の引数をリストに追加する (ArrowFunctionExpression)', () => {
      const list: string[] = [];
      const node = createArrowFunctionExpression(['arg1', 'arg2']);
      addArgumentsToList(node, list);
      expect(list).toEqual(['arg1', 'arg2']);
    });
  });
});
