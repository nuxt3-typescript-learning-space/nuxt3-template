import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { STATE_REGEX_PATTERN, GETTERS_REGEX_PATTERN } from '../../../data/utils/constant';
import { safeReadFile } from '../../../data/utils/file';
import { logMessage } from '../../../data/utils/logger';
import {
  extractContentByRegex,
  filterStatePropertyName,
  extractValuesByRegex,
  filterGetterPropertyName,
  getUniqueValues,
} from '../../../data/utils/regex'; // 実際のファイルパスに置き換えてください

vi.mock('../../../data/utils/file', () => ({
  safeReadFile: vi.fn(),
  writeJsonFile: vi.fn(),
}));

vi.mock('../../../data/utils/logger', () => ({
  logMessage: vi.fn(),
}));
describe('settings/data/utils/regex.ts', () => {
  describe('extractContentByRegex', () => {
    const testFilePath = 'test/file/path.txt';
    const fileContent = `
    state: (): State => ({
      count: 0,
    }),
    getters: {
      getCount: (state) => state.count,
      getCount2(state) {
        return state.count + 2;
      },
      getCount3: (state: State) => (num: number) => state.count + num,
      getCount4(state: State) {
        return (num: number) => state.count + num;
      },
      getCount5: (state: State) => (num: number) => {
        state.count += num;
        return state.count + num;
      },
      getCount6(state) {
        return (num: number) => {
          state.count += num;
          return state.count + num;
        };
      },
    },
    actions: {
      increment() {
        this.count++;
      },
      decrement() {
        this.count--;
      },
    },
  `;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('正規表現に一致する state の内容を抽出する', () => {
      (safeReadFile as MockedFunction<typeof safeReadFile>).mockReturnValue(fileContent);

      const result = extractContentByRegex(testFilePath, STATE_REGEX_PATTERN);

      expect(result.trim()).toBe('count: 0,');
    });

    it('正規表現に一致する getters の内容を抽出する', () => {
      (safeReadFile as MockedFunction<typeof safeReadFile>).mockReturnValue(fileContent);

      const result = extractContentByRegex(testFilePath, GETTERS_REGEX_PATTERN);

      expect(result.trim()).toBe(
        `
      getCount: (state) => state.count,
      getCount2(state) {
        return state.count + 2;
      },
      getCount3: (state: State) => (num: number) => state.count + num,
      getCount4(state: State) {
        return (num: number) => state.count + num;
      },
      getCount5: (state: State) => (num: number) => {
        state.count += num;
        return state.count + num;
      },
      getCount6(state) {
        return (num: number) => {
          state.count += num;
          return state.count + num;
        };
      },
    `.trim(),
      );
    });

    it('正規表現に一致しない場合に空文字列を返す', () => {
      (safeReadFile as MockedFunction<typeof safeReadFile>).mockReturnValue('no match content');

      const result = extractContentByRegex(testFilePath, STATE_REGEX_PATTERN);

      expect(result).toBe('');
      expect(logMessage).toHaveBeenCalledWith(`パターンがファイルに一致しませんでした: ${testFilePath}`);
    });
  });

  describe('filterStatePropertyName', () => {
    const content = `
    count: 0,
  `;

    it('stateのトップレベルのプロパティ名を抽出する', () => {
      const result = filterStatePropertyName(content.trim());

      expect(result).toEqual(['count']);
    });
  });

  describe('filterGetterPropertyName', () => {
    const content = `
    getCount: (state) => state.count,
    getCount2(state) {
      return state.count + 2;
    },
    getCount3: (state: State) => (num: number) => state.count + num,
    getCount4(state: State) {
      return (num: number) => state.count + num;
    },
    getCount5: (state: State) => (num: number) => {
      state.count += num;
      return state.count + num;
    },
    getCount6(state) {
      return (num: number) => {
        state.count += num;
        return state.count + num;
      };
    },
  `;

    it('gettersのトップレベルのプロパティ名を抽出する', () => {
      const result = filterGetterPropertyName(content.trim());

      expect(result).toEqual(['getCount', 'getCount2', 'getCount3', 'getCount4', 'getCount5', 'getCount6']);
    });
  });

  describe('extractValuesByRegex', () => {
    const testFilePath = 'test/file/testStore.ts';
    const stateContent = `
    state: (): State => ({
      count: 0,
      user: {
        name: 'test',
        age: 20,
      }
    }),
  `;
    const gettersContent = `
    getters: {
      getCount: (state) => state.count,
      getCount2(state) {
        return state.count + 2;
      },
      getCount3: (state: State) => (num: number) => state.count + num,
      getCount4(state: State) {
        return (num: number) => state.count + num;
      },
      getCount5: (state: State) => (num: number) => {
        state.count += num;
        return state.count + num;
      },
      getCount6(state) {
        return (num: number) => {
          state.count += num;
          return state.count + num;
        };
      },
    },
    actions: {},
  `;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('stateのプロパティ名を抽出する', () => {
      (safeReadFile as MockedFunction<typeof safeReadFile>).mockReturnValue(stateContent);

      const result = extractValuesByRegex(testFilePath, STATE_REGEX_PATTERN, false);

      expect(result).toEqual(['count', 'user']);
    });

    it('gettersのプロパティ名を抽出する', () => {
      (safeReadFile as MockedFunction<typeof safeReadFile>).mockReturnValue(gettersContent);

      const result = extractValuesByRegex(testFilePath, GETTERS_REGEX_PATTERN, true);

      expect(result).toEqual(['getCount', 'getCount2', 'getCount3', 'getCount4', 'getCount5', 'getCount6']);
    });
  });

  describe('getUniqueValues', () => {
    it('配列から一意の値を取得する', () => {
      const values = ['apple', 'banana', 'apple', 'orange', 'banana'];
      const result = getUniqueValues(values);

      expect(result).toEqual(['apple', 'banana', 'orange']);
    });
  });
});
