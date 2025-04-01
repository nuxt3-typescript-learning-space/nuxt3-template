import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { vi } from 'vitest';
import type { StateTree } from 'pinia';

/**
 * テスト用のPiniaインスタンスを作成するヘルパー関数
 *
 * @param initialState - Piniaストアに設定する初期状態（デフォルトは空オブジェクト）
 * @returns テスト用Piniaインスタンス
 */
export function bindTestingPinia(initialState: StateTree = {}): TestingPinia {
  const testingPinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
    initialState,
  });

  return testingPinia;
}
