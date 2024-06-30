import { safeReadFile } from './file.js';
import { logMessage } from './logger.js';

/**
 * 正規表現パターンを使用してファイルから値を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp} regex - 値を抽出するための正規表現パターン
 * @returns {string[]} - 抽出された値の配列
 */
export const extractValuesByRegex = (filePath, regex) => {
  const fileContent = safeReadFile(filePath);
  const match = regex.exec(fileContent);
  if (!match) {
    logMessage(`パターンがファイルに一致しませんでした: ${filePath}`);
    return [];
  }
  const content = match[1] || match[2] || '';
  return content
    .split(',')
    .map((line) => line.trim().split(/[:(]/)[0].trim())
    .filter(Boolean);
};

/**
 * 配列から一意の値を取得する関数
 * @param {string[]} values - 値の配列
 * @returns {string[]} - 一意の値の配列
 */
export const getUniqueValues = (values) => [...new Set(values)];
