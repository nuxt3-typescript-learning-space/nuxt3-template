import prettier from 'prettier';
import { readFile, safeWriteFile } from './file.js';
import { handleError } from './logger.js';

/**
 * JSONファイルの内容を読み込む関数
 * @param {string} filePath - 読み込むJSONファイルのパス
 * @returns {object} - JSONファイルの内容
 */
export const readJsonFile = (filePath) => {
  try {
    return JSON.parse(readFile(filePath));
  } catch (error) {
    handleError(`JSONファイルの読み込み中にエラーが発生しました: ${filePath}`, error);
    throw error;
  }
};

/**
 * JSONファイルの内容を書き込む関数
 * @param {string} filePath - 書き込むJSONファイルのパス
 * @param {object} json - 書き込むJSONデータ
 */
export const writeJsonFile = async (filePath, json) => {
  try {
    // JSON文字列を整形するためにprettier.formatを使用
    const formattedJson = await prettier.format(JSON.stringify(json), { parser: 'json' });
    // 整形されたJSON文字列をファイルに書き込む
    safeWriteFile(filePath, formattedJson);
  } catch (error) {
    handleError(`JSONファイルの整形中にエラーが発生しました: ${filePath}`, error);
    throw error;
  }
};
