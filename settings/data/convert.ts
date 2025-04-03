import { updateGettersValues } from './updateGettersValues';
import { updateStateValues } from './updateStateValues';

/**
 * ストアデータのリストを更新するメイン処理
 */
export const updateStoreListData = async (): Promise<void> => {
  try {
    await updateStateValues();
    await updateGettersValues();
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`An error occurred: ${error.message}`, error); // eslint-disable-line no-console
    } else {
      console.warn(`Unexpected error occurred: ${String(error)}`); // eslint-disable-line no-console
    }
  }
};

await updateStoreListData();
