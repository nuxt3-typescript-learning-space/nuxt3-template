/**
 * ログ出力関数
 * @param {string} message - ログメッセージ
 */
export const logMessage = (message) => {
  console.log(message); // eslint-disable-line no-console
};

/**
 * 共通のエラーハンドリング関数
 * @param {string} message - エラーメッセージ
 * @param {unknown} error - 発生したエラー
 */
export const handleError = (message, error) => {
  console.error(`${message}\n詳細:`, error); // eslint-disable-line no-console
};
