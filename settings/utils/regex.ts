import { safeReadFile } from './file';
import { logMessage } from './logger';

/**
 * ファイルから正規表現に一致する内容を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp} regex - 正規表現パターン
 * @returns {string} - 抽出された内容
 */
const extractContentByRegex = (filePath: string, regex: RegExp): string => {
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
const filterGetterNames = (content: string): string[] => {
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
    .filter((name): name is string => name !== null);

  return getterNames;
};

/**
 * 正規表現パターンを使用してファイルからgetterのプロパティ名を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp} regex - 正規表現パターン
 * @returns {string[]} - 抽出されたgetterのプロパティ名の配列
 */
export const extractValuesByRegex = (filePath: string, regex: RegExp): string[] => {
  const content = extractContentByRegex(filePath, regex);
  return filterGetterNames(content);
};

/**
 * 配列から一意の値を取得する関数
 * @param {string[]} values - 値の配列
 * @returns {string[]} - 一意の値の配列
 */
export const getUniqueValues = (values: string[]): string[] => [...new Set(values)];
