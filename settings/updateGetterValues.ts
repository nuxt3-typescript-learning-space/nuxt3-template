import { globSync } from 'glob';
import { GETTERS_REGEX_PATTERN, STORE_DIR, STORE_GETTERS_LIST_PATH } from './utils/constant';
import { readJsonFile, writeJsonFile } from './utils/json';
import { logMessage } from './utils/logger';
import { extractValuesByRegex, getUniqueValues } from './utils/regex';

/**
 * gettersのプロパティ名を抽出してJSONファイルを更新する関数
 *
 * この関数は、storeディレクトリ内のすべてのTypeScriptファイルをスキャンし、正規表現を使用して
 * gettersのプロパティ名を抽出します。抽出したプロパティ名は一意にフィルタリングされ、既存の
 * store-getters-list.jsonファイルに追加されます。
 */
const updateGetterValues = async (): Promise<void> => {
  // storeディレクトリ内のすべてのTypeScriptファイルを取得
  const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);

  // 各ファイルからgettersのプロパティ名を抽出
  const allGetterValues = storeFiles.flatMap((filePath) => extractValuesByRegex(filePath, GETTERS_REGEX_PATTERN, true));

  // 抽出したプロパティ名を一意にフィルタリング
  const uniqueGetterValues = getUniqueValues(allGetterValues);

  // 既存のstore-getters-list.jsonファイルを読み込む
  const storeGettersList = readJsonFile(STORE_GETTERS_LIST_PATH);

  // 抽出したプロパティ名で既存のリストをフィルタリング
  const updatedGettersList = storeGettersList.filter((value) => uniqueGetterValues.includes(value));

  // 新しいプロパティ名をリストに追加
  uniqueGetterValues.forEach((value) => {
    if (!updatedGettersList.includes(value)) {
      updatedGettersList.push(value);
    }
  });

  // 更新されたリストをstore-getters-list.jsonファイルに書き込む
  await writeJsonFile(STORE_GETTERS_LIST_PATH, updatedGettersList);

  // 更新完了のメッセージをログに出力
  logMessage('store-getters-list.json が更新されました。');
};

export default updateGetterValues;
