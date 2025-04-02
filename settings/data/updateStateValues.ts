import { globSync } from 'glob';
import { STORE_DIR, STORE_STATE_LIST_PATH } from './utils/constant';
import { writeJsonFile } from './utils/file';
import { extractStateProperties } from './utils/parser';

/**
 * stateのプロパティ名を抽出してJSONファイルを更新する関数
 */
export const updateStateValues = async (): Promise<void> => {
  try {
    const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);

    if (storeFiles.length === 0) {
      throw new Error(`No ".ts" files found in ${STORE_DIR} directory.`);
    }

    const allStateValues = storeFiles.flatMap((filePath) => {
      try {
        return extractStateProperties(filePath);
      } catch (error) {
        console.warn(`Error extracting state from file ${filePath}:`, error); // eslint-disable-line no-console
        return [];
      }
    });

    const uniqueStateValues = [...new Set(allStateValues)];

    await writeJsonFile(STORE_STATE_LIST_PATH, uniqueStateValues);
  } catch (error) {
    throw new Error(`State list update error: ${error instanceof Error ? error.message : String(error)}`);
  }
};
