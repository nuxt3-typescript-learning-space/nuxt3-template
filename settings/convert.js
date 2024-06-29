import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// ESModulesで__dirnameを取得する
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定数の宣言
const PROJECT_ROOT = path.resolve(__dirname, '..');
const STORE_DIR = path.resolve(PROJECT_ROOT, './src/store');
const STORE_STATE_LIST_PATH = path.resolve(PROJECT_ROOT, './settings/rules/data/store-state-list.json');

/**
 * 正規表現パターンの定義
 * この正規表現は、以下のようなstateオブジェクトの定義をキャプチャするためのものです:
 * state: (): State => ({
 *   foo: 'bar',
 *   baz: 'qux',
 * })
 * または
 * state: () => ({
 *   foo: 'bar',
 *   baz: 'qux',
 * })
 */
const STATE_REGEX = /state\s*:\s*\(\)\s*:\s*\w+\s*=>\s*\(\s*{([\s\S]*?)}\s*\)|state\s*:\s*\(\)\s*=>\s*\({([\s\S]*?)}\)/;

/**
 * 共通のエラーハンドリング関数
 * @param {string} message - エラーメッセージ
 * @param {unknown} error - 発生したエラー
 */
const handleError = (message, error) => {
  console.error(`${message}\n詳細:`, error); // eslint-disable-line no-console
};

/**
 * ログ出力関数
 * @param {string} message - ログメッセージ
 */
const logMessage = (message) => {
  console.log(message); // eslint-disable-line no-console
};

/**
 * ファイルの存在確認関数
 * @param {string} filePath - チェックするファイルのパス
 * @returns {boolean} - ファイルが存在するかどうか
 */
const fileExists = (filePath) => fs.existsSync(filePath);

/**
 * ファイルを読み込む関数
 * @param {string} filePath - 読み込むファイルのパス
 * @returns {string} - ファイルの内容
 * @throws {Error} - ファイルが存在しない場合にエラーをスロー
 */
const readFile = (filePath) => {
  if (!fileExists(filePath)) {
    throw new Error(`ファイルが存在しません: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
};

/**
 * ファイルを書き込む関数
 * @param {string} filePath - 書き込むファイルのパス
 * @param {string} data - 書き込むデータ
 */
const writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, data);
};

/**
 * ファイルを安全に読み込む関数（エラーハンドリング込み）
 * @param {string} filePath - 読み込むファイルのパス
 * @returns {string} - ファイルの内容
 */
const safeReadFile = (filePath) => {
  try {
    return readFile(filePath);
  } catch (error) {
    handleError(`ファイルの読み込み中にエラーが発生しました: ${filePath}`, error);
    throw error;
  }
};

/**
 * ファイルを安全に書き込む関数（エラーハンドリング込み）
 * @param {string} filePath - 書き込むファイルのパス
 * @param {string} data - 書き込むデータ
 */
const safeWriteFile = (filePath, data) => {
  try {
    writeFile(filePath, data);
  } catch (error) {
    handleError(`ファイルの書き込み中にエラーが発生しました: ${filePath}`, error);
    throw error;
  }
};

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

/**
 * JSONファイルの内容を読み込む関数
 * @param {string} filePath - 読み込むJSONファイルのパス
 * @returns {string[]} - JSONファイルの内容
 */
const readJsonFile = (filePath) => {
  try {
    return JSON.parse(readFile(filePath));
  } catch (error) {
    handleError(`JSONファイルの読み込み中にエラーが発生しました: ${filePath}`, error);
    throw error;
  }
};

/**
 * JSONファイルの内容を書き込む関数
 * @param {string} filePath - 書き込むJSONファイルのパス
 * @param {object} json - 書き込むJSONデータ
 */
const writeJsonFile = (filePath, json) => {
  safeWriteFile(filePath, JSON.stringify(json, null, 2));
};

// 全てのstoreファイルを取得
const storeFiles = globSync(`${STORE_DIR}/**/*.ts`);

// 全storeファイルからstateの値を抽出
const allStateValues = storeFiles.flatMap(extractStateValues);

// 重複を除去して一意の値を取得
const uniqueStateValues = getUniqueValues(allStateValues);

// store-state-list.jsonの現在の内容を取得
const storeStateList = readJsonFile(STORE_STATE_LIST_PATH);

/**
 * 現在のstore-state-list.jsonに含まれているが、最新の抽出されたstate値に含まれていない項目を削除
 * @type {string[]}
 */
const updatedStateList = storeStateList.filter((value) => uniqueStateValues.includes(value));

// 最新の抽出されたstate値でstore-state-list.jsonを更新
uniqueStateValues.forEach((value) => {
  if (!updatedStateList.includes(value)) {
    updatedStateList.push(value);
  }
});

// JSONファイルに書き込み
writeJsonFile(STORE_STATE_LIST_PATH, updatedStateList);

logMessage('store-state-list.jsonが更新されました。');
