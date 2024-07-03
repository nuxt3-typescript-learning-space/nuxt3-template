import { globSync } from 'glob';
import { STATE_REGEX_PATTERN, STORE_DIR, STORE_STATE_LIST_PATH } from './utils/constant';
import { writeJsonFile } from './utils/json';
import { updateList } from './utils/list';
import { logMessage } from './utils/logger';
import { extractValuesByRegex, getUniqueValues } from './utils/regex';

/**
 * stateのプロパティ名を抽出してJSONファイルを更新する関数
 */
export const updateStateValues = async (): Promise<void> => {
  const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);
  const allStateValues = storeFiles.flatMap((filePath) => extractValuesByRegex(filePath, STATE_REGEX_PATTERN, false));
  const uniqueStateValues = getUniqueValues(allStateValues);
  const updatedStateList = updateList(uniqueStateValues);
  await writeJsonFile(STORE_STATE_LIST_PATH, updatedStateList);
  logMessage('store-state-list.json が更新されました。');
};
