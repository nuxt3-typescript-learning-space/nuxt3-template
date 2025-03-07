import { describe, it, expect, vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import { updateStoreListData } from '~~/settings/data/convert';
import { updateGetterValues } from '~~/settings/data/updateGetterValues';
import { updateStateValues } from '~~/settings/data/updateStateValues';
import { logMessage } from '~~/settings/data/utils/logger';

// モジュールのモックを設定します
vi.mock('~~/settings/data/updateGetterValues', () => ({
  updateGetterValues: vi.fn(),
}));

vi.mock('~~/settings/data/updateStateValues', () => ({
  updateStateValues: vi.fn(),
}));

vi.mock('~~/settings/data/utils/logger', () => ({
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
