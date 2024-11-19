import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Title from '@/components/features/sample/Title.vue';
import { useSampleStore } from '@/store/sampleStore';
import { bindTestingPinia, mountSuspendedComponent } from '@/test/testHelper';
import type { TestingPinia } from '@pinia/testing';

describe('src/features/sample/components/Title.vue', () => {
  let pinia: TestingPinia;
  let sampleStore: ReturnType<typeof useSampleStore>;

  beforeEach(() => {
    pinia = bindTestingPinia();
    sampleStore = useSampleStore();
    sampleStore.fetchTitle = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('isFetchingStateがtrueのとき、ローディング文言が表示されること', async () => {
    sampleStore.isFetching = true;
    const wrapper = await mountSuspendedComponent(Title, pinia);
    await flushPromises();
    expect(wrapper.find('p').text()).toBe('Loading...');
  });

  test('isFetchingStateがfalseのとき、titleStateが表示されること', async () => {
    sampleStore.isFetching = false;
    sampleStore.title = 'test';
    const wrapper = await mountSuspendedComponent(Title, pinia);
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('test');
  });

  test('コンポーネントマウント時にfetchTitleが呼び出されること', async () => {
    await mountSuspendedComponent(Title, pinia);
    expect(sampleStore.fetchTitle).toHaveBeenCalled();
  });
});
