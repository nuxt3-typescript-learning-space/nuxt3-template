import fs from 'fs';
import { handleError } from './logger';

/**
 * ファイルの存在確認関数
 * @param {string} filePath - チェックするファイルのパス
 * @returns {boolean} - ファイルが存在するかどうか
 */
export const fileExists = (filePath: string): boolean => fs.existsSync(filePath);

/**
 * ファイルを読み込む関数
 * @param {string} filePath - 読み込むファイルのパス
 * @returns {string} - ファイルの内容
 * @throws {Error} - ファイルが存在しない場合にエラーをスロー
 */
export const readFile = (filePath: string): string => {
  if (!fileExists(filePath)) {
    throw new Error(`ファイルが存在しません: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
};

/**
 * ファイルを書き込む関数
 * @param {string} filePath - 書き込むファイルのパス
 * @param {string} data - 書き込むデータ
 */
export const writeFile = (filePath: string, data: string): void => {
  fs.writeFileSync(filePath, data);
};

/**
 * ファイルを安全に読み込む関数（エラーハンドリング込み）
 * @param {string} filePath - 読み込むファイルのパス
 * @returns {string} - ファイルの内容
 */
export const safeReadFile = (filePath: string): string => {
  try {
    return readFile(filePath);
  } catch (error) {
    handleError(`ファイルの読み込み中にエラーが発生しました: ${filePath}`, error);
    throw error;
  }
};

/**
 * ファイルを安全に書き込む関数（エラーハンドリング込み）
 * @param {string} filePath - 書き込むファイルのパス
 * @param {string} data - 書き込むデータ
 */
export const safeWriteFile = (filePath: string, data: string): void => {
  try {
    writeFile(filePath, data);
  } catch (error) {
    handleError(`ファイルの書き込み中にエラーが発生しました: ${filePath}`, error);
    throw error;
  }
};
