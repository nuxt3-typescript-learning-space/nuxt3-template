import { updateGetterValues } from './updateGetterValues';
import { updateStateValues } from './updateStateValues';

/**
 * ストアデータのリストを更新するメイン処理
 */
export const updateStoreListData = async (): Promise<void> => {
  try {
    await updateStateValues();
    await updateGetterValues();
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`An error occurred: ${error.message}`, error); // eslint-disable-line no-console
    } else {
      console.warn(`Unexpected error occurred: ${String(error)}`); // eslint-disable-line no-console
    }
  }
};

await updateStoreListData();
