import updateGetterNames from './updateGetterNames.js';
import updateStateValues from './updateStateValues.js';
import { logMessage } from './utils/logger.js';

/**
 * ストアデータを更新するメイン処理
 * @returns {Promise<void>}
 */
const updateStoreData = async () => {
  try {
    await updateStateValues();
    await updateGetterNames();
  } catch (error) {
    logMessage(`エラーが発生しました: ${error.message}`);
  }
};

updateStoreData();
