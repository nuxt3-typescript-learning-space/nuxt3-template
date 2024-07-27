import { describe, it, expect, vi } from 'vitest';
import { updateStoreListData } from '../../data/convert';
import { updateGetterValues } from '../../data/updateGetterValues';
import { updateStateValues } from '../../data/updateStateValues';
import { logMessage } from '../../data/utils/logger';
import type { MockedFunction } from 'vitest';

// モジュールのモックを設定します
vi.mock('../../data/updateGetterValues', () => ({
  updateGetterValues: vi.fn(),
}));

vi.mock('../../data/updateStateValues', () => ({
  updateStateValues: vi.fn(),
}));

vi.mock('../../data/utils/logger', () => ({
  logMessage: vi.fn(),
}));

describe('settings/data/convert.ts', () => {
  it('updateStateValuesとupdateGetterValuesが呼び出されるべき', async () => {
    await updateStoreListData();

    expect(updateStateValues).toHaveBeenCalled();
    expect(updateGetterValues).toHaveBeenCalled();
  });

  it('エラーが発生した場合、logMessageが呼び出されるべき', async () => {
    const error = new Error('テストエラー');
    (updateStateValues as MockedFunction<typeof updateStateValues>).mockRejectedValueOnce(error);

    await updateStoreListData();

    expect(logMessage).toHaveBeenCalledWith(`エラーが発生しました: ${error}`);
  });
});
