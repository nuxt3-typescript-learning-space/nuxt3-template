import { safeReadFile } from './file';
import { logMessage } from './logger';

/**
 * ファイルから正規表現に一致する内容を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp[]} patterns - 一致させる正規表現の配列
 * @returns {string} - 一致した内容の最初のグループ、または空文字列
 */
const extractContentByRegex = (filePath: string, patterns: RegExp[]): string => {
  // ファイルの内容を読み込む
  const fileContent = safeReadFile(filePath);

  // 各正規表現パターンに対して一致する内容を検索
  for (const regex of patterns) {
    const match = regex.exec(fileContent);
    if (match) {
      // 一致した内容を返す
      return match[1] || match[2] || '';
    }
  }
  // 一致しなかった場合はログメッセージを出力
  logMessage(`パターンがファイルに一致しませんでした: ${filePath}`);
  return '';
};

/**
 * 行をフィルタリングしてstateのトップレベルのプロパティ名を抽出する関数
 * @param {string} content - ファイルの内容
 * @returns {string[]} - トップレベルのプロパティ名の配列
 */
const filterStatePropertyName = (content: string): string[] => {
  // ファイルの内容を行ごとに分割し、不要な行をフィルタリング
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('*') && !line.startsWith('/**') && !line.startsWith('//'));

  const propertyNames: string[] = [];
  let braceCount = 0;

  lines.forEach((line) => {
    // braceCountが0のときにトップレベルのプロパティ名を抽出
    if (braceCount === 0 && line.includes(':')) {
      const match = line.match(/^(\w+)\s*:/);
      if (match && match[1] !== 'return') {
        propertyNames.push(match[1]);
      }
    }

    // 中括弧の数をカウントしてbraceCountを調整
    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;
  });

  return propertyNames;
};

/**
 * 正規表現に一致する内容からプロパティ名を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp[]} regexPattern - 一致させる正規表現の配列
 * @param {boolean} isGetters - Gettersかどうかを判別するフラグ
 * @returns {string[]} - プロパティ名の配列
 */
export const extractValuesByRegex = (filePath: string, regexPattern: RegExp[], isGetters: boolean): string[] => {
  // ファイルから正規表現に一致する内容を抽出
  const content = extractContentByRegex(filePath, regexPattern);

  // 抽出した内容からプロパティ名をフィルタリング
  const propertyNames = isGetters ? filterGetterPropertyName(content) : filterStatePropertyName(content);
  return propertyNames;
};

/**
 * 行をフィルタリングしてgettersのトップレベルのプロパティ名を抽出する関数
 * @param {string} content - ファイルの内容
 * @returns {string[]} - トップレベルのプロパティ名の配列
 */
const filterGetterPropertyName = (content: string): string[] => {
  // ファイルの内容を行ごとに分割し、不要な行をフィルタリング
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('*') && !line.startsWith('/**') && !line.startsWith('//'));

  const propertyNames: string[] = [];
  let braceCount = 0;

  lines.forEach((line) => {
    // braceCountが0のときにトップレベルのプロパティ名を抽出
    if (braceCount === 0 && (line.includes(':') || line.includes('('))) {
      const match = line.match(/^(\w+)\s*:/) || line.match(/^(\w+)\s*\(/);
      if (match) {
        propertyNames.push(match[1]);
      }
    }

    // 中括弧の数をカウントしてbraceCountを調整
    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;
  });

  return propertyNames;
};

/**
 * 配列から一意の値を取得する関数
 * @param {string[]} values - 値の配列
 * @returns {string[]} - 一意の値の配列
 */
export const getUniqueValues = (values: string[]): string[] => {
  // 配列から一意の値を取得して返す
  const uniqueValues = [...new Set(values)];
  return uniqueValues;
};
