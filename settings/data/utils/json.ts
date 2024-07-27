import { format } from 'prettier';
import { safeWriteFile } from './file';
import { handleError } from './logger';

/**
 * JSONファイルの内容を書き込む関数
 * @param {string} filePath - 書き込むJSONファイルのパス
 * @param {string[]} json - 書き込むJSONデータ
 */
export const writeJsonFile = async (filePath: string, json: string[]) => {
  try {
    // JSON文字列を整形するためにprettier.formatを使用
    const formattedJson = await format(JSON.stringify(json), { parser: 'json' });
    // 整形されたJSON文字列をファイルに書き込む
    safeWriteFile(filePath, formattedJson);
  } catch (error) {
    handleError(`JSONファイルの整形中にエラーが発生しました: ${filePath}`, error);
    throw error;
  }
};
