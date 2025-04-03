/**
 * キャッチしたエラーをWarnログとして出力する関数（開発環境用）
 * @param message - ログに出すメッセージ
 * @param error - catchしたerrorオブジェクト
 */
/* eslint-disable no-console */
export const echoWarningLog = (message: string, error: Error | unknown): void => {
  const errorType = getErrorType(error);

  switch (errorType) {
    case 'error': {
      const err = error as Error;
      console.warn(`${message}: ${err.message}\n${err.stack}`);
      break;
    }
    case 'null':
      console.warn(`${message}: null`);
      break;
    case 'undefined':
      console.warn(`${message}: undefined`);
      break;
    case 'object':
      try {
        console.warn(`${message}: ${JSON.stringify(error)}`);
      } catch {
        console.warn(`${message}: [Object 変換不可]`);
      }
      break;
    default:
      console.warn(`${message}: ${String(error)}`);
  }
};
/* eslint-enable no-console */

/**
 * エラーの型を判別する
 */
function getErrorType(error: Error | unknown): 'error' | 'null' | 'undefined' | 'object' | 'other' {
  if (error instanceof Error) return 'error';
  if (error === null) return 'null';
  if (error === undefined) return 'undefined';
  if (typeof error === 'object') return 'object';
  return 'other';
}
