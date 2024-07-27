import { globSync } from 'glob';
import { describe, it, expect, vi } from 'vitest';
import { updateGetterValues } from '../../data/updateGetterValues';
import { GETTERS_REGEX_PATTERN, STORE_DIR, STORE_GETTERS_LIST_PATH } from '../../data/utils/constant';
import { writeJsonFile } from '../../data/utils/json';
import { updateList } from '../../data/utils/list';
import { logMessage } from '../../data/utils/logger';
import { extractValuesByRegex, getUniqueValues } from '../../data/utils/regex';
import type { MockedFunction } from 'vitest';

// モジュールのモックを設定します
vi.mock('glob', () => ({
  globSync: vi.fn(),
}));

vi.mock('../../data/utils/json', () => ({
  writeJsonFile: vi.fn(),
}));

vi.mock('../../data/utils/list', () => ({
  updateList: vi.fn(),
}));

vi.mock('../../data/utils/logger', () => ({
  logMessage: vi.fn(),
}));

vi.mock('../../data/utils/regex', () => ({
  extractValuesByRegex: vi.fn(),
  getUniqueValues: vi.fn(),
}));

describe('settings/data/updateGetterValues.ts', () => {
  it('必要な関数が正しく呼び出され、GETTERS_REGEX_PATTERNが使用されるべき', async () => {
    // モックの設定
    const mockFiles = ['file1.ts', 'file2.ts'];
    const mockValuesFile1 = ['value1', 'value2'];
    const mockValuesFile2 = ['value1'];
    const allMockValues = [...mockValuesFile1, ...mockValuesFile2];
    const uniqueValues = ['value1', 'value2'];
    const updatedList = ['updatedValue1', 'updatedValue2'];

    (globSync as MockedFunction<typeof globSync>).mockReturnValue(mockFiles);
    (extractValuesByRegex as MockedFunction<typeof extractValuesByRegex>).mockImplementation((filePath, regex) => {
      if (regex === GETTERS_REGEX_PATTERN) {
        return filePath === 'file1.ts' ? mockValuesFile1 : mockValuesFile2;
      }
      return [];
    });
    (getUniqueValues as MockedFunction<typeof getUniqueValues>).mockReturnValue(uniqueValues);
    (updateList as MockedFunction<typeof updateList>).mockReturnValue(updatedList);

    await updateGetterValues();

    // 各関数が正しく呼び出されることを確認
    expect(globSync).toHaveBeenCalledWith(`${STORE_DIR}/**/*.ts`);
    expect(extractValuesByRegex).toHaveBeenCalledTimes(mockFiles.length);
    expect(extractValuesByRegex).toHaveBeenCalledWith('file1.ts', GETTERS_REGEX_PATTERN, true);
    expect(extractValuesByRegex).toHaveBeenCalledWith('file2.ts', GETTERS_REGEX_PATTERN, true);
    expect(getUniqueValues).toHaveBeenCalledWith(allMockValues);
    expect(updateList).toHaveBeenCalledWith(uniqueValues);
    expect(writeJsonFile).toHaveBeenCalledWith(STORE_GETTERS_LIST_PATH, updatedList);
    expect(logMessage).toHaveBeenCalledWith('store-getters-list.json が更新されました。');
  });
});
