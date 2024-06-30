import updateGetterValues from './updateGetterValues';
import updateStateValues from './updateStateValues';
import { logMessage } from './utils/logger';

/**
 * ストアデータを更新するメイン処理
 * @returns {Promise<void>}
 */
const updateStoreData = async (): Promise<void> => {
  try {
    await updateStateValues();
    await updateGetterValues();
  } catch (error) {
    logMessage(`エラーが発生しました: ${error}`);
  }
};

updateStoreData();
