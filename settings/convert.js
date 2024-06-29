import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// ESModulesで__dirnameを取得する
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// project-root ディレクトリを基準にパスを解決
const projectRoot = path.resolve(__dirname, '..');

// src/storeディレクトリのパス
const storeDir = path.resolve(projectRoot, './src/store');

// store-state-list.jsonのパス
const storeStateListPath = path.resolve(projectRoot, './settings/rules/data/store-state-list.json');

// 全てのstoreファイルを取得
const storeFiles = globSync(`${storeDir}/**/*.ts`);

// stateの値を抽出する関数
const extractStateValues = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const stateValues = [];
  const stateRegex =
    /state\s*:\s*\(\)\s*:\s*\w+\s*=>\s*\(\s*{([\s\S]*?)}\s*\)|state\s*:\s*\(\)\s*=>\s*\({([\s\S]*?)}\)/;

  const match = stateRegex.exec(fileContent);
  if (match) {
    const stateContent = match[1] || match[2];
    const stateLines = stateContent
      .split(',')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    stateLines.forEach((line) => {
      const [key] = line.split(':');
      if (key) {
        stateValues.push(key.trim());
      }
    });
  } else {
    // デバッグ: 正規表現に一致しなかった場合
    // eslint-disable-next-line no-console
    console.log('ファイルに対する正規表現に一致しませんでした:', filePath);
  }

  return stateValues;
};

// 全storeファイルからstateの値を抽出
const allStateValues = storeFiles.flatMap(extractStateValues);

// 重複を除去して一意の値を取得
const uniqueStateValues = [...new Set(allStateValues)];

// store-state-list.jsonの現在の内容を取得
const storeStateList = JSON.parse(fs.readFileSync(storeStateListPath, 'utf8'));

// 現在のstore-state-list.jsonに含まれているが、最新の抽出されたstate値に含まれていない項目を削除
const updatedStateList = storeStateList.filter((value) => uniqueStateValues.includes(value));

// 最新の抽出されたstate値でstore-state-list.jsonを更新
uniqueStateValues.forEach((value) => {
  if (!updatedStateList.includes(value)) {
    updatedStateList.push(value);
  }
});

// JSONファイルに書き込み
fs.writeFileSync(storeStateListPath, JSON.stringify(updatedStateList, null, 2));

// eslint-disable-next-line no-console
console.log('store-state-list.jsonが更新されました。');
