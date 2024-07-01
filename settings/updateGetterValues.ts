import { globSync } from 'glob';
import { GETTER_PATTERNS, STORE_DIR, STORE_GETTERS_LIST_PATH } from './utils/constant';
import { readJsonFile, writeJsonFile } from './utils/json';
import { logMessage } from './utils/logger';
import { extractValuesByPatterns, getUniqueValues } from './utils/regex';

/**
 * gettersのプロパティ名を抽出してJSONファイルを更新する関数
 */
const updateGetterValues = async (): Promise<void> => {
  const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);
  const allGetterValues = storeFiles.flatMap((filePath) => extractValuesByPatterns(filePath, GETTER_PATTERNS, false));
  const uniqueGetterValues = getUniqueValues(allGetterValues);

  const storeGettersList = readJsonFile(STORE_GETTERS_LIST_PATH);
  const updatedGettersList = storeGettersList.filter((value) => uniqueGetterValues.includes(value));
  uniqueGetterValues.forEach((value) => {
    if (!updatedGettersList.includes(value)) {
      updatedGettersList.push(value);
    }
  });
  await writeJsonFile(STORE_GETTERS_LIST_PATH, updatedGettersList);
  logMessage('store-getters-list.json が更新されました。');
};

export default updateGetterValues;
