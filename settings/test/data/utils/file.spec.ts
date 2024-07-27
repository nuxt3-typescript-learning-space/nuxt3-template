import fs from 'fs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fileExists, readFile, writeFile, safeReadFile, safeWriteFile } from '../../../data/utils/file';
import { handleError } from '../../../data/utils/logger';
import type { MockedFunction } from 'vitest';

// fs モジュールのモック
vi.mock('fs');
vi.mock('../../../data/utils/logger', () => ({
  handleError: vi.fn(),
}));

describe('settings/data/utils/file.ts', () => {
  const testFilePath = 'src/store/testStore.ts';
  const testData = 'これはテストデータです';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fileExists', () => {
    it('ファイルが存在する場合に true を返す', () => {
      (fs.existsSync as MockedFunction<typeof fs.existsSync>).mockReturnValue(true);
      const result = fileExists(testFilePath);
      expect(result).toBe(true);
    });

    it('ファイルが存在しない場合に false を返す', () => {
      (fs.existsSync as MockedFunction<typeof fs.existsSync>).mockReturnValue(false);
      const result = fileExists(testFilePath);
      expect(result).toBe(false);
    });
  });

  describe('readFile', () => {
    it('ファイルが存在する場合にファイルの内容を読み取る', () => {
      (fs.existsSync as MockedFunction<typeof fs.existsSync>).mockReturnValue(true);
      (fs.readFileSync as MockedFunction<typeof fs.readFileSync>).mockReturnValue(testData);
      const result = readFile(testFilePath);
      expect(result).toBe(testData);
      expect(fs.readFileSync).toHaveBeenCalledWith(testFilePath, 'utf8');
    });

    it('ファイルが存在しない場合にエラーをスローする', () => {
      (fs.existsSync as MockedFunction<typeof fs.existsSync>).mockReturnValue(false);
      expect(() => readFile(testFilePath)).toThrow(`ファイルが存在しません: ${testFilePath}`);
    });
  });

  describe('writeFile', () => {
    it('ファイルにデータを書き込む', () => {
      writeFile(testFilePath, testData);
      expect(fs.writeFileSync).toHaveBeenCalledWith(testFilePath, testData);
    });
  });

  describe('safeReadFile', () => {
    it('ファイルが存在する場合にファイルの内容を読み取る', () => {
      (fs.existsSync as MockedFunction<typeof fs.existsSync>).mockReturnValue(true);
      (fs.readFileSync as MockedFunction<typeof fs.readFileSync>).mockReturnValue(testData);
      const result = safeReadFile(testFilePath);
      expect(result).toBe(testData);
      expect(fs.readFileSync).toHaveBeenCalledWith(testFilePath, 'utf8');
    });

    it('ファイルが存在しない場合にエラーハンドリングを行う', () => {
      (fs.existsSync as MockedFunction<typeof fs.existsSync>).mockReturnValue(false);
      expect(() => safeReadFile(testFilePath)).toThrow();
      expect(handleError).toHaveBeenCalledWith(
        `ファイルの読み込み中にエラーが発生しました: ${testFilePath}`,
        expect.any(Error),
      );
    });
  });

  describe('safeWriteFile', () => {
    it('ファイルにデータを安全に書き込む', () => {
      safeWriteFile(testFilePath, testData);
      expect(fs.writeFileSync).toHaveBeenCalledWith(testFilePath, testData);
    });

    it('書き込み操作中にエラーが発生した場合にエラーハンドリングを行う', () => {
      (fs.writeFileSync as MockedFunction<typeof fs.writeFileSync>).mockImplementation(() => {
        throw new Error('書き込みエラー');
      });
      expect(() => safeWriteFile(testFilePath, testData)).toThrow();
      expect(handleError).toHaveBeenCalledWith(
        `ファイルの書き込み中にエラーが発生しました: ${testFilePath}`,
        expect.any(Error),
      );
    });
  });
});
