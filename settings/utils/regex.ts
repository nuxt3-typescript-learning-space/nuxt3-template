import { safeReadFile } from './file';
import { logMessage } from './logger';

/**
 * ファイルから正規表現に一致する内容を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp[]} patterns - 一致させる正規表現の配列
 * @returns {string} - 一致した内容の最初のグループ、または空文字列
 */
const extractContentByRegex = (filePath: string, patterns: RegExp[]): string => {
  const fileContent = safeReadFile(filePath);
  for (const regex of patterns) {
    const match = regex.exec(fileContent);
    if (match) {
      return match[1] || match[2] || '';
    }
  }
  logMessage(`パターンがファイルに一致しませんでした: ${filePath}`);
  return '';
};

/**
 * 行をフィルタリングしてトップレベルのプロパティ名を抽出する関数
 * @param {string} content - ファイルの内容
 * @returns {string[]} - トップレベルのプロパティ名の配列
 */
const filterPropertyName = (content: string): string[] => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('*') && !line.startsWith('/**') && !line.startsWith('//'));

  const propertyNames: string[] = [];
  let braceCount = 0;

  lines.forEach((line) => {
    if (braceCount === 0 && line.includes(':')) {
      const match = line.match(/^(\w+)\s*:/);
      if (match && match[1] !== 'return') {
        propertyNames.push(match[1]);
      }
    }

    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;
  });

  return propertyNames;
};

/**
 * 正規表現に一致する内容からプロパティ名を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp[]} regex - 一致させる正規表現の配列
 * @returns {string[]} - プロパティ名の配列
 */
export const extractValuesByRegex = (filePath: string, regex: RegExp[]): string[] => {
  const content = extractContentByRegex(filePath, regex);
  return filterPropertyName(content);
};

/**
 * 配列から一意の値を取得する関数
 * @param {string[]} values - 値の配列
 * @returns {string[]} - 一意の値の配列
 */
export const getUniqueValues = (values: string[]): string[] => [...new Set(values)];
