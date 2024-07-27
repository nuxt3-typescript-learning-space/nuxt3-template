import { updateGetterValues } from './updateGetterValues';
import { updateStateValues } from './updateStateValues';
import { logMessage } from './utils/logger';

/**
 * ストアデータのリストを更新するメイン処理
 * @returns {Promise<void>}
 */
export const updateStoreListData = async (): Promise<void> => {
  try {
    await updateStateValues();
    await updateGetterValues();
  } catch (error) {
    logMessage(`エラーが発生しました: ${error}`);
  }
};

updateStoreListData();
