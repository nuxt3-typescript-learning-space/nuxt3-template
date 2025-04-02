import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { PROJECT_ROOT } from './constant';

/**
 * ファイルの存在をチェックする関数
 * @param filePath - チェックするファイルのパス
 * @returns ファイルが存在する場合はtrue、存在しない場合やエラーの場合はfalse
 */
export const checkFileExists = (filePath: string): boolean => {
  try {
    return existsSync(filePath);
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`File existence check failed: ${error.message}`, error); // eslint-disable-line no-console
    } else {
      console.warn(`Unexpected file existence check error occurred: ${String(error)}`); // eslint-disable-line no-console
    }
    return false;
  }
};

/**
 * ファイルを読み込む関数
 * @param filePath - 読み込むファイルのパス
 * @returns ファイルの内容
 * @throws エラーが発生した場合はErrorをスロー
 */
export const readFile = (filePath: string): string => {
  const hasFile = checkFileExists(filePath);

  if (!hasFile) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`File read error: ${error.message}`);
    } else {
      throw new Error(`Unexpected file read error occurred: ${String(error)}`);
    }
  }
};

/**
 * ファイルにデータを書き込む関数
 * @param filePath - 書き込むファイルのパス
 * @param data - 書き込むデータ
 * @throws エラーが発生した場合はErrorをスロー
 */
export const writeFile = (filePath: string, data: string): void => {
  try {
    writeFileSync(filePath, data, 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`File write error: ${error.message}`);
    } else {
      throw new Error(`Unexpected file write error occurred: ${String(error)}`);
    }
  }
};

/**
 * JSONファイルにデータを書き込む関数
 * @param filePath - 書き込み先のJSONファイルのパス
 * @param data - 書き込むデータ
 * @throws エラーが発生した場合はErrorをスロー
 */
export const writeJsonFile = async <T>(filePath: string, data: T): Promise<void> => {
  try {
    const options = await resolveConfig(join(PROJECT_ROOT, 'prettier.config.mjs'));
    const formattedJson = await format(JSON.stringify(data), { ...options, parser: 'json' });
    writeFile(filePath, formattedJson);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`JSON file write error: ${error.message}`);
    } else {
      throw new Error(`Unexpected JSON file write error occurred: ${String(error)}`);
    }
  }
};
