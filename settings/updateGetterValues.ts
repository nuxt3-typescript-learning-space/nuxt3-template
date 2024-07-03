import { globSync } from 'glob';
import { GETTERS_REGEX_PATTERN, STORE_DIR, STORE_GETTERS_LIST_PATH } from './utils/constant';
import { writeJsonFile } from './utils/json';
import { updateList } from './utils/list';
import { logMessage } from './utils/logger';
import { extractValuesByRegex, getUniqueValues } from './utils/regex';

/**
 * gettersのプロパティ名を抽出してJSONファイルを更新する関数
 */
export const updateGetterValues = async (): Promise<void> => {
  const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);
  const allGetterValues = storeFiles.flatMap((filePath) => extractValuesByRegex(filePath, GETTERS_REGEX_PATTERN, true));
  const uniqueGetterValues = getUniqueValues(allGetterValues);
  const updatedGettersList = updateList(uniqueGetterValues);
  await writeJsonFile(STORE_GETTERS_LIST_PATH, updatedGettersList);
  logMessage('store-getters-list.json が更新されました。');
};
