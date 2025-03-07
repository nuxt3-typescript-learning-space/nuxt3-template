import { describe, expect, vi, beforeEach, test } from 'vitest';
import { logMessage, handleError } from '~~/settings/data/utils/logger';

describe('settings/data/utils/logger.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logMessage', () => {
    test('ログメッセージを出力する', () => {
      const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});
      const testMessage = 'これはテストメッセージです';

      logMessage(testMessage);

      expect(consoleLogMock).toHaveBeenCalledWith(testMessage);
      consoleLogMock.mockRestore();
    });
  });

  describe('handleError', () => {
    test('エラーメッセージを出力し、詳細を含める', () => {
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
      const testMessage = 'エラーメッセージ';
      const testError = new Error('テストエラー');

      handleError(testMessage, testError);

      expect(consoleErrorMock).toHaveBeenCalledWith(`${testMessage}\n詳細:`, testError);
      consoleErrorMock.mockRestore();
    });

    test('エラーメッセージを出力し、unknown型のエラーを含める', () => {
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
      const testMessage = 'エラーメッセージ';
      const testError = 'テストエラー';

      handleError(testMessage, testError);

      expect(consoleErrorMock).toHaveBeenCalledWith(`${testMessage}\n詳細:`, testError);
      consoleErrorMock.mockRestore();
    });
  });
});
