import { globSync } from 'glob';
import { STATE_REGEX_PATTERN, STORE_DIR, STORE_STATE_LIST_PATH } from './utils/constant';
import { readJsonFile, writeJsonFile } from './utils/json';
import { logMessage } from './utils/logger';
import { extractValuesByRegex, getUniqueValues } from './utils/regex';

/**
 * stateのプロパティ名を抽出してJSONファイルを更新する関数
 *
 * この関数は、storeディレクトリ内のすべてのTypeScriptファイルをスキャンし、正規表現を使用して
 * stateのプロパティ名を抽出します。抽出したプロパティ名は一意にフィルタリングされ、既存の
 * store-state-list.jsonファイルに追加されます。
 */
const updateStateValues = async (): Promise<void> => {
  // storeディレクトリ内のすべてのTypeScriptファイルを取得
  const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);

  // 各ファイルからstateのプロパティ名を抽出
  const allStateValues = storeFiles.flatMap((filePath) => extractValuesByRegex(filePath, STATE_REGEX_PATTERN, false));

  // 抽出したプロパティ名を一意にフィルタリング
  const uniqueStateValues = getUniqueValues(allStateValues);

  // 既存のstore-state-list.jsonファイルを読み込む
  const storeStateList = readJsonFile(STORE_STATE_LIST_PATH);

  // 抽出したプロパティ名で既存のリストをフィルタリング
  const updatedStateList = storeStateList.filter((value) => uniqueStateValues.includes(value));

  // 新しいプロパティ名をリストに追加
  uniqueStateValues.forEach((value) => {
    if (!updatedStateList.includes(value)) {
      updatedStateList.push(value);
    }
  });

  // 更新されたリストをstore-state-list.jsonファイルに書き込む
  await writeJsonFile(STORE_STATE_LIST_PATH, updatedStateList);

  // 更新完了のメッセージをログに出力
  logMessage('store-state-list.json が更新されました。');
};

export default updateStateValues;
