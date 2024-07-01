import { safeReadFile } from './file';

/**
 * ファイルから正規表現に一致する内容を抽出する関数
 * @param {string} filePath - ファイルのパス
 * @param {RegExp[]} patterns - 正規表現パターンのリスト
 * @param {boolean} isState - stateかgettersかを示すフラグ
 * @returns {string[]} - 抽出された内容の配列
 */
export const extractValuesByPatterns = (filePath: string, patterns: RegExp[], isState: boolean): string[] => {
  const fileContent = safeReadFile(filePath);
  const matches = patterns.flatMap((pattern) => {
    const match = pattern.exec(fileContent);
    return match ? match[1] || '' : '';
  });

  return matches.filter((match) => match).flatMap((content) => filterTopLevelNames(content, isState));
};

/**
 * 行をフィルタリングしてトップレベルのプロパティ名を抽出する関数
 * @param {string} content - フィルタリングする内容
 * @param {boolean} isState - stateかgettersかを示すフラグ
 * @returns {string[]} - 抽出されたプロパティ名の配列
 */
const filterTopLevelNames = (content: string, isState: boolean): string[] => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('*') && !line.startsWith('/**') && !line.startsWith('//'));

  const values = lines
    .map((line) => {
      const match = line.match(/^(\w+)\s*[:(]/);
      return match ? match[1] : null;
    })
    .filter((name): name is string => name !== null && name !== 'return');

  // stateの場合、ネストされたプロパティを除外する
  if (isState) {
    return values.filter(
      (name) => !lines.some((line) => line.startsWith(name + ': {') || line.startsWith(name + ':[')),
    );
  }

  // gettersの場合、トップレベルのプロパティのみを取得
  return values.filter((name) => !lines.some((line) => line.startsWith(name + ': {') || line.startsWith(name + ':{')));
};

/**
 * 配列から一意の値を取得する関数
 * @param {string[]} values - 値の配列
 * @returns {string[]} - 一意の値の配列
 */
export const getUniqueValues = (values: string[]): string[] => [...new Set(values)];
