import { describe, expect, test } from 'vitest';
import { updateList } from '~~/settings/data/utils/list';

describe('settings/data/utils/list.ts', () => {
  describe('updateList', () => {
    test('新しい値のリストを更新して重複を除外する', () => {
      const input = ['apple', 'banana', 'apple', 'orange'];
      const expectedOutput = ['apple', 'banana', 'orange'];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });

    test('空のリストを処理する', () => {
      const input: string[] = [];
      const expectedOutput: string[] = [];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });

    test('重複のないリストを処理する', () => {
      const input = ['apple', 'banana', 'orange'];
      const expectedOutput = ['apple', 'banana', 'orange'];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });

    test('すべて同じ値のリストを処理する', () => {
      const input = ['apple', 'apple', 'apple'];
      const expectedOutput = ['apple'];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });

    test('新しい値が一つだけのリストを処理する', () => {
      const input = ['apple'];
      const expectedOutput = ['apple'];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });
  });
});
