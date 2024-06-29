import { globSync } from 'glob';
import { STATE_REGEX, STORE_DIR, STORE_STATE_LIST_PATH } from './utils/constant.js';
import { safeReadFile } from './utils/file.js';
import { readJsonFile, writeJsonFile } from './utils/json.js';
import { logMessage } from './utils/logger.js';

// 定数の宣言

/**
 * stateの値を抽出する関数
 * @param {string} filePath - 抽出するファイルのパス
 * @returns {string[]} - 抽出されたstateの値の配列
 */
const extractStateValues = (filePath) => {
  const fileContent = safeReadFile(filePath);
  const match = STATE_REGEX.exec(fileContent);
  if (!match) {
    logMessage(`ファイルに対する正規表現に一致しませんでした: ${filePath}`);
    return [];
  }

  const stateContent = match[1] || match[2];
  return stateContent
    .split(',')
    .map((line) => line.trim().split(':')[0].trim())
    .filter(Boolean);
};

/**
 * 重複を除去して一意の値を取得する関数
 * @param {string[]} values - 処理する値の配列
 * @returns {string[]} - 一意の値の配列
 */
const getUniqueValues = (values) => [...new Set(values)];

// 全てのstoreファイルを取得
const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);

// 全storeファイルからstateの値を抽出
const allStateValues = storeFiles.flatMap(extractStateValues);

// 重複を除去して一意の値を取得
const uniqueStateValues = getUniqueValues(allStateValues);

// store-state-list.jsonの現在の内容を取得
const storeStateList = readJsonFile(STORE_STATE_LIST_PATH);

// 現在のstore-state-list.jsonに含まれているが、最新の抽出されたstate値に含まれていない項目を削除
/**
 *
 * @type {string[]}
 */
const updatedStateList = storeStateList.filter((value) => uniqueStateValues.includes(value));

// 最新の抽出されたstate値でstore-state-list.jsonを更新
uniqueStateValues.forEach((value) => {
  if (!updatedStateList.includes(value)) {
    updatedStateList.push(value);
  }
});

// store-state-list.jsonを更新
await writeJsonFile(STORE_STATE_LIST_PATH, updatedStateList);

logMessage('store-state-list.jsonが更新されました。');
