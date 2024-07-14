import { describe, it, expect } from 'vitest';
import { updateList } from '../../../data/utils/list';

describe('settings/data/utils/list.ts', () => {
  describe('updateList', () => {
    it('新しい値のリストを更新して重複を除外する', () => {
      const input = ['apple', 'banana', 'apple', 'orange'];
      const expectedOutput = ['apple', 'banana', 'orange'];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });

    it('空のリストを処理する', () => {
      const input: string[] = [];
      const expectedOutput: string[] = [];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });

    it('重複のないリストを処理する', () => {
      const input = ['apple', 'banana', 'orange'];
      const expectedOutput = ['apple', 'banana', 'orange'];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });

    it('すべて同じ値のリストを処理する', () => {
      const input = ['apple', 'apple', 'apple'];
      const expectedOutput = ['apple'];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });

    it('新しい値が一つだけのリストを処理する', () => {
      const input = ['apple'];
      const expectedOutput = ['apple'];

      const result = updateList(input);

      expect(result).toEqual(expectedOutput);
    });
  });
});
