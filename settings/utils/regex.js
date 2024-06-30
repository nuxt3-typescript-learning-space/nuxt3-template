import { safeReadFile } from './file.js';
import { logMessage } from './logger.js';

/**
 * ファイルから正規表現に一致する内容を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp} regex - 正規表現パターン
 * @returns {string} - 抽出された内容
 */
const extractContentByRegex = (filePath, regex) => {
  const fileContent = safeReadFile(filePath);
  const match = regex.exec(fileContent);
  if (!match) {
    logMessage(`パターンがファイルに一致しませんでした: ${filePath}`);
    return '';
  }
  return match[1] || match[2] || '';
};

/**
 * 行をフィルタリングしてgetterのプロパティ名を抽出する関数
 * @param {string} content - フィルタリングする内容
 * @returns {string[]} - 抽出されたgetterのプロパティ名の配列
 */
const filterGetterNames = (content) => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('*') && !line.startsWith('/**') && !line.startsWith('//'));

  const getterNames = lines
    .map((line) => {
      const match = line.match(/^(\w+)\s*[:(]/);
      if (match && match[1] !== 'return') {
        return match[1];
      }
      return null;
    })
    .filter(Boolean);

  return getterNames;
};

/**
 * 正規表現パターンを使用してファイルからgetterのプロパティ名を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp} regex - 正規表現パターン
 * @returns {string[]} - 抽出されたgetterのプロパティ名の配列
 */
export const extractValuesByRegex = (filePath, regex) => {
  const content = extractContentByRegex(filePath, regex);
  return filterGetterNames(content);
};

/**
 * 配列から一意の値を取得する関数
 * @param {string[]} values - 値の配列
 * @returns {string[]} - 一意の値の配列
 */
export const getUniqueValues = (values) => [...new Set(values)];
