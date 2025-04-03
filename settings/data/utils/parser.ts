import { readFile } from './file';
import { createSourceFileFromContent } from './parser/astUtils';
import { findDefineStoreCallsAndExtractGettersProperties } from './parser/getters';
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
  const stateList = findDefineStoreCallsAndExtractStateProperties(sourceFile);
  return stateList;
};

/**
 * 指定されたファイルからgettersプロパティを抽出するエントリ関数
 *
 * @param filePath ゲッタープロパティを抽出するファイルのパス
 * @returns 抽出されたゲッタープロパティ名の配列
 */
export const extractGettersProperties = (filePath: string) => {
  const fileContent = readFile(filePath);
  const sourceFile = createSourceFileFromContent(filePath, fileContent);
  const gettersList = findDefineStoreCallsAndExtractGettersProperties(sourceFile);
  return gettersList;
};
