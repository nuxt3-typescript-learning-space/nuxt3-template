import { readFile } from './file';
import { createSourceFileFromContent } from './parser/astUtils';
import { findDefineStoreCallsAndExtractStateProperties } from './parser/state';
import type { SourceFile } from 'typescript';

/**
 * SourceFileからstateプロパティを抽出する純粋関数
 *
 * @param sourceFile ステートプロパティを抽出するソースファイル
 * @returns 抽出されたステートプロパティ名の配列
 */
const extractStatePropertiesFromSourceFile = (sourceFile: SourceFile): string[] => {
  return findDefineStoreCallsAndExtractStateProperties(sourceFile);
};

/**
 * 指定されたファイルからstateプロパティを抽出するエントリ関数
 *
 * @param filePath ステートプロパティを抽出するファイルのパス
 * @returns 抽出されたステートプロパティ名の配列
 */
export const extractStateProperties = (filePath: string): string[] => {
  const fileContent = readFile(filePath);
  const sourceFile = createSourceFileFromContent(filePath, fileContent);
  return extractStatePropertiesFromSourceFile(sourceFile);
};
