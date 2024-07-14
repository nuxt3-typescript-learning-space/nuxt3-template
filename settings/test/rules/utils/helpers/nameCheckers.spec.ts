import { describe, it, expect } from 'vitest';
import { hasStateNameWithoutStateSuffix, isGetterAliasPresent } from '../../../../rules/utils/helpers/nameCheckers';

describe('settings/rules/utils/helpers/nameCheckers.js', () => {
  describe('hasStateNameWithoutStateSuffix', () => {
    it('変数名がstateリストに含まれていて、接尾辞が "State" で終わっていない場合にtrueを返す', () => {
      const stateList = ['count', 'user', 'name'];
      expect(hasStateNameWithoutStateSuffix('count', 'count', stateList)).toBe(true);
      expect(hasStateNameWithoutStateSuffix('user', 'userState', stateList)).toBe(false);
      expect(hasStateNameWithoutStateSuffix('name', 'name', stateList)).toBe(true);
      expect(hasStateNameWithoutStateSuffix('age', 'age', stateList)).toBe(false);
    });

    it('変数名がstateリストに含まれていない場合にfalseを返す', () => {
      const stateList = ['count', 'user', 'name'];
      expect(hasStateNameWithoutStateSuffix('age', 'age', stateList)).toBe(false);
      expect(hasStateNameWithoutStateSuffix('location', 'location', stateList)).toBe(false);
    });
  });

  describe('isGetterAliasPresent', () => {
    it('プロパティがgettersListに含まれていて、別名が設定されている場合にtrueを返す', () => {
      const gettersList = ['getCount', 'getUser', 'getName'];
      expect(isGetterAliasPresent('getCount', 'countAlias', gettersList)).toBe(true);
      expect(isGetterAliasPresent('getUser', 'userAlias', gettersList)).toBe(true);
      expect(isGetterAliasPresent('getName', 'nameAlias', gettersList)).toBe(true);
    });

    it('プロパティがgettersListに含まれていない場合にfalseを返す', () => {
      const gettersList = ['getCount', 'getUser', 'getName'];
      expect(isGetterAliasPresent('getAge', 'ageAlias', gettersList)).toBe(false);
      expect(isGetterAliasPresent('getLocation', 'locationAlias', gettersList)).toBe(false);
    });

    it('別名が設定されていない場合にfalseを返す', () => {
      const gettersList = ['getCount', 'getUser', 'getName'];
      expect(isGetterAliasPresent('getCount', 'getCount', gettersList)).toBe(false);
      expect(isGetterAliasPresent('getUser', '', gettersList)).toBe(false);
    });
  });
});
