import { format } from 'prettier';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { safeWriteFile } from '~~/settings/data/utils/file';
import { writeJsonFile } from '~~/settings/data/utils/json';
import { handleError } from '~~/settings/data/utils/logger';

vi.mock('prettier', () => ({
  format: vi.fn(),
}));
vi.mock('~~/settings/data/utils/file', () => ({
  safeWriteFile: vi.fn(),
}));
vi.mock('~~/settings/data/utils/logger', () => ({
  handleError: vi.fn(),
}));

describe('settings/data/utils/json.ts', () => {
  const testFilePath = 'test/file/test.json';
  const testJson = ['これはテストデータです'];
  const formattedJson = JSON.stringify(testJson, null, 2); // prettier で整形されることを仮定したフォーマット

  describe('writeJsonFile', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('JSONデータを整形してファイルに書き込む', async () => {
      (format as MockedFunction<typeof format>).mockResolvedValue(formattedJson);

      await writeJsonFile(testFilePath, testJson);

      expect(format).toHaveBeenCalledWith(JSON.stringify(testJson), { parser: 'json' });
      expect(safeWriteFile).toHaveBeenCalledWith(testFilePath, formattedJson);
    });

    it('整形中にエラーが発生した場合にエラーハンドリングを行う', async () => {
      const error = new Error('整形エラー');
      (format as MockedFunction<typeof format>).mockRejectedValue(error);

      await expect(writeJsonFile(testFilePath, testJson)).rejects.toThrow(error);

      expect(handleError).toHaveBeenCalledWith(`JSONファイルの整形中にエラーが発生しました: ${testFilePath}`, error);
    });
  });
});
