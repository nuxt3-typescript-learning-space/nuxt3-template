import { readFile } from './file';
import { createSourceFileFromContent } from './parser/astUtils';
import { findDefineStoreCallsAndExtractStateProperties } from './parser/state';

/**
 * 指定されたファイルからstateプロパティを抽出するエントリ関数
 *
 * @param filePath ステートプロパティを抽出するファイルのパス
 * @returns 抽出されたステートプロパティ名の配列
 */
export const extractStateProperties = (filePath: string): string[] => {
  const fileContent = readFile(filePath);
  const sourceFile = createSourceFileFromContent(filePath, fileContent);
  return findDefineStoreCallsAndExtractStateProperties(sourceFile);
};
