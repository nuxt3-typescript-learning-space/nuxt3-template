/**
 * ログ出力関数
 * @param {string} message - ログメッセージ
 */
export const logMessage = (message: string) => {
  console.log(message); // eslint-disable-line no-console
};

/**
 * 共通のエラーハンドリング関数
 * @param {string} message - エラーメッセージ
 * @param {unknown} error - 発生したエラー
 */
export const handleError = (message: string, error: unknown) => {
  console.error(`${message}\n詳細:`, error); // eslint-disable-line no-console
};
