import { globSync } from 'glob';
import { STORE_DIR, STORE_GETTERS_LIST_PATH } from './utils/constant';
import { writeJsonFile } from './utils/file';
import { extractGettersProperties } from './utils/parser';

/**
 * gettersのプロパティ名を抽出してJSONファイルを更新する関数
 */
export const updateGettersValues = async (): Promise<void> => {
  try {
    const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);

    if (storeFiles.length === 0) {
      console.info(`No ".ts" files found in ${STORE_DIR} directory.`); // eslint-disable-line no-console
      return;
    }

    const allGettersValues = storeFiles.flatMap((filePath) => {
      try {
        return extractGettersProperties(filePath);
      } catch (error) {
        console.warn(`Error extracting getters from file ${filePath}:`, error); // eslint-disable-line no-console
        return [];
      }
    });

    const uniqueGettersValues = [...new Set(allGettersValues)];

    await writeJsonFile(STORE_GETTERS_LIST_PATH, uniqueGettersValues);
  } catch (error) {
    throw new Error(`Getters list update error: ${error instanceof Error ? error.message : String(error)}`);
  }
};
