import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logMessage, handleError } from '../../../data/utils/logger';

describe('settings/data/utils/logger.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logMessage', () => {
    it('ログメッセージを出力する', () => {
      const consoleLogMock = vi.spyOn(console, 'log').mockImplementation(() => {});
      const testMessage = 'これはテストメッセージです';

      logMessage(testMessage);

      expect(consoleLogMock).toHaveBeenCalledWith(testMessage);
      consoleLogMock.mockRestore();
    });
  });

  describe('handleError', () => {
    it('エラーメッセージを出力し、詳細を含める', () => {
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
      const testMessage = 'エラーメッセージ';
      const testError = new Error('テストエラー');

      handleError(testMessage, testError);

      expect(consoleErrorMock).toHaveBeenCalledWith(`${testMessage}\n詳細:`, testError);
      consoleErrorMock.mockRestore();
    });

    it('エラーメッセージを出力し、unknown型のエラーを含める', () => {
      const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
      const testMessage = 'エラーメッセージ';
      const testError = 'テストエラー';

      handleError(testMessage, testError);

      expect(consoleErrorMock).toHaveBeenCalledWith(`${testMessage}\n詳細:`, testError);
      consoleErrorMock.mockRestore();
    });
  });
});
