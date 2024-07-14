import { describe, it, expect } from 'vitest';
import { addToList, extractPropertyNames } from '../../../../rules/utils/helpers/arrayHelpers';
import type { Property } from 'estree';

describe('settings/rules/utils/helpers/arrayHelpers.js', () => {
  it('addToListはリストにアイテムを追加する', () => {
    const list = ['a', 'b'];
    const items = ['c', 'd'];
    addToList(list, items);
    expect(list).toEqual(['a', 'b', 'c', 'd']);
  });

  it('extractPropertyNamesはプロパティ名を抽出する', () => {
    const properties = [
      {
        type: 'Property',
        key: { type: 'Identifier', name: 'prop1' },
        value: { type: 'Identifier', name: 'prop1' },
        kind: 'init',
        method: false,
        shorthand: false,
        computed: false,
      },
      {
        type: 'Property',
        key: { type: 'Identifier', name: 'prop2' },
        value: { type: 'Identifier', name: 'prop2' },
        kind: 'init',
        method: false,
        shorthand: false,
        computed: false,
      },
      {
        type: 'Property',
        key: { type: 'Identifier', name: 'prop3' },
        value: { type: 'Identifier', name: 'prop3' },
        kind: 'init',
        method: false,
        shorthand: false,
        computed: false,
      },
    ];
    const result = extractPropertyNames(properties as Property[]);
    expect(result).toEqual(['prop1', 'prop2', 'prop3']);
  });
});
