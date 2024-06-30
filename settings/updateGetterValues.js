import { globSync } from 'glob';
import { GETTERS_REGEX, STORE_DIR, STORE_GETTERS_LIST_PATH } from './utils/constant.js';
import { readJsonFile, writeJsonFile } from './utils/json.js';
import { logMessage } from './utils/logger.js';
import { extractValuesByRegex, getUniqueValues } from './utils/regex.js';

/**
 * gettersのプロパティ名を抽出してJSONファイルを更新する関数
 */
const updateGetterValues = async () => {
  const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);
  const allGetterNames = storeFiles.flatMap((filePath) => extractValuesByRegex(filePath, GETTERS_REGEX));
  const uniqueGetterNames = getUniqueValues(allGetterNames);

  const storeGettersList = readJsonFile(STORE_GETTERS_LIST_PATH);
  const updatedGettersList = storeGettersList.filter((value) => uniqueGetterNames.includes(value));
  uniqueGetterNames.forEach((value) => {
    if (!updatedGettersList.includes(value)) {
      updatedGettersList.push(value);
    }
  });
  await writeJsonFile(STORE_GETTERS_LIST_PATH, updatedGettersList);
  logMessage('store-getters-list.json が更新されました。');
};

export default updateGetterValues;
